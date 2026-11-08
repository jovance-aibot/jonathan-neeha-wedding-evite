import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('keeps the map off the page until asked, without opening directions itself', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    render(<Invitation now={new Date('2026-11-07T12:00:00+05:30')} />)

    expect(document.querySelector('iframe')).toBeNull()
    const directions = screen.getByRole('link', { name: eventConfig.map.directionsLabel })
    expect(directions).toHaveAttribute('href', 'https://maps.app.goo.gl/6DUQjm4gRWES4AgY6?g_st=ic')

    const toggle = screen.getByRole('button', { name: eventConfig.map.showLabel })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)

    const frame = document.querySelector('iframe')
    const hide = screen.getByRole('button', { name: eventConfig.map.hideLabel })
    expect(frame).not.toBeNull()
    expect(frame).toHaveAttribute('src', eventConfig.map.embedUrl)
    expect(frame?.getAttribute('src')).toContain('Philips+pavilion,+Memury')
    expect(frame?.getAttribute('allow') ?? '').not.toMatch(/geolocation/i)
    expect(hide).toHaveAttribute('aria-expanded', 'true')
    expect(hide).toHaveAttribute('aria-controls', 'venue-map')
    expect(hide).toHaveFocus()
    expect(directions).toHaveAttribute('href', eventConfig.map.directionsUrl)

    await user.click(hide)

    expect(document.querySelector('iframe')).toBeNull()
    const showAgain = screen.getByRole('button', { name: eventConfig.map.showLabel })
    expect(showAgain).toHaveAttribute('aria-expanded', 'false')
    expect(showAgain).toHaveFocus()
    expect(directions).toHaveAttribute('href', eventConfig.map.directionsUrl)

    await user.click(showAgain)

    expect(document.querySelector('iframe')).toHaveAttribute('src', eventConfig.map.embedUrl)
    expect(screen.getByRole('button', { name: eventConfig.map.hideLabel })).toHaveFocus()
    expect(directions).toHaveAttribute('href', 'https://maps.app.goo.gl/6DUQjm4gRWES4AgY6?g_st=ic')
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('follows the photo layout without a verse, RSVP, or empty photo frames', () => {
    render(<Invitation now={new Date('2026-11-07T12:00:00+05:30')} />)
    const images = screen.getAllByRole('img')
    expect(images.map((image) => image.getAttribute('alt'))).toEqual([
      'Stock photograph of a couple seen from behind, walking at sunset. Not Jonathan and Neeha.',
      "Stock photograph of a bride and groom's hands and wedding rings. Not Jonathan and Neeha.",
      'Stock photograph of an outdoor evening gathering under trees. Not Philip Pavilion.',
    ])
    expect(images[0]).toHaveAttribute('loading', 'eager')
    expect(images[1]).toHaveAttribute('loading', 'lazy')
    expect(images[2]).toHaveAttribute('loading', 'lazy')
    expect(screen.getByText('See you there')).toBeInTheDocument()
    expect(screen.getByText('Jonathan & Neeha')).toBeInTheDocument()
    expect(screen.getByText(eventConfig.stock.note)).toBeInTheDocument()
    expect(screen.getByText('Philip Pavilion')).toBeInTheDocument()
    expect(screen.getByText(eventConfig.reception.note)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /rsvp/i })).not.toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/two are better|ecclesiastes|music is omitted|draft preview/i)
    const following = Node.DOCUMENT_POSITION_FOLLOWING
    const ceremony = screen.getByText(eventConfig.ceremony.timeDisplay)
    const venue = screen.getByRole('heading', { name: 'Venue' })
    const close = screen.getByText('See you there')
    expect(images[0].compareDocumentPosition(ceremony) & following).toBeTruthy()
    expect(ceremony.compareDocumentPosition(images[1]) & following).toBeTruthy()
    expect(images[1].compareDocumentPosition(venue) & following).toBeTruthy()
    expect(venue.compareDocumentPosition(images[2]) & following).toBeTruthy()
    expect(images[2].compareDocumentPosition(close) & following).toBeTruthy()
  })
})
