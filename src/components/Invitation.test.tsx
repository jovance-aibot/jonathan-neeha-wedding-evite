import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { eventConfig } from '../config/event.ts'
import { Invitation } from './Invitation.tsx'

const target = new Date('2026-12-28T15:30:00+05:30')

describe('invitation details', () => {
  it('shows an expired ceremony instead of a zero clock', () => {
    render(<Invitation now={target} />)
    expect(screen.getByText(eventConfig.countdown.expiredMessage)).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Time remaining' })).not.toBeInTheDocument()
  })

  it('names a single remaining day and a final partial second', () => {
    const { rerender } = render(<Invitation now={new Date(target.getTime() - 86400000)} />)
    expect(screen.getByText('day')).toBeInTheDocument()
    expect(screen.queryByText('days')).not.toBeInTheDocument()
    rerender(<Invitation now={new Date(target.getTime() - 500)} />)
    expect(screen.getByText(eventConfig.countdown.lessThanSecondMessage)).toBeInTheDocument()
  })

  it('explains an unreadable countdown', () => {
    render(
      <Invitation
        config={{
          ...eventConfig,
          countdown: { ...eventConfig.countdown, targetIso: 'not-a-date' },
        }}
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent(eventConfig.countdown.invalidMessage)
  })

  it('does not offer a calendar download', () => {
    const createUrl = vi.spyOn(URL, 'createObjectURL')
    render(<Invitation now={new Date('2026-11-07T12:00:00+05:30')} />)

    expect(screen.queryByRole('button', { name: /calendar/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /calendar/i })).not.toBeInTheDocument()
    expect(document.querySelector('a[download]')).toBeNull()
    expect(document.body.textContent).not.toMatch(/\.ics|download ceremony calendar|add to calendar/i)
    expect(createUrl).not.toHaveBeenCalled()
    expect(screen.getByText(eventConfig.ceremony.timeDisplay)).toBeInTheDocument()
    expect(screen.getByText(eventConfig.reception.timeDisplay)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: eventConfig.map.directionsLabel })).toHaveAttribute(
      'href',
      eventConfig.map.directionsUrl,
    )
  })

  it('offers directions only, with no map embed', () => {
    render(<Invitation now={new Date('2026-11-07T12:00:00+05:30')} />)
    const directions = screen.getByRole('link', { name: eventConfig.map.directionsLabel })
    expect(directions).toHaveAttribute('href', 'https://maps.app.goo.gl/6DUQjm4gRWES4AgY6?g_st=ic')
    expect(directions).toHaveAttribute('target', '_blank')
    expect(directions).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.queryByRole('button', { name: /map/i })).not.toBeInTheDocument()
    expect(document.querySelector('iframe')).toBeNull()
    expect(document.body.textContent).not.toMatch(/show map|hide map|google maps/i)
  })

  it('follows the photo layout without a verse, RSVP, or empty photo frames', () => {
    render(<Invitation now={new Date('2026-11-07T12:00:00+05:30')} />)
    const images = screen.getAllByRole('img')
    expect(images.map((image) => image.getAttribute('alt'))).toEqual([
      'A couple seen from behind, walking at sunset.',
      'Hands with wedding rings.',
    ])
    expect(images[0]).toHaveAttribute('loading', 'eager')
    expect(images[1]).toHaveAttribute('loading', 'lazy')
    expect(screen.getByText('See you there')).toBeInTheDocument()
    expect(screen.getByText('Jonathan & Neeha')).toBeInTheDocument()
    expect(screen.getByText('Philip Pavilion')).toBeInTheDocument()
    expect(screen.getByText('Outdoors · same venue')).toBeInTheDocument()
    expect(screen.queryByText('Outdoors at Philip Pavilion.')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /rsvp/i })).not.toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(
      /two are better|ecclesiastes|music is omitted|draft preview|end time is not set|yet to get|still unsettled|to be confirmed|placeholder|stock/i,
    )
    const following = Node.DOCUMENT_POSITION_FOLLOWING
    const ceremony = screen.getByText(eventConfig.ceremony.timeDisplay)
    const venue = screen.getByRole('heading', { name: 'Venue' })
    const close = screen.getByText('See you there')
    expect(images[0].compareDocumentPosition(ceremony) & following).toBeTruthy()
    expect(ceremony.compareDocumentPosition(images[1]) & following).toBeTruthy()
    expect(images[1].compareDocumentPosition(venue) & following).toBeTruthy()
    expect(venue.compareDocumentPosition(close) & following).toBeTruthy()
  })
})
