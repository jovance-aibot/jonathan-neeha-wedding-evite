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
    expect(document.querySelectorAll('.when')[0]?.textContent).toBe(eventConfig.ceremony.timeDisplay)
    expect(document.querySelectorAll('.when')[1]?.textContent).toBe(eventConfig.reception.timeDisplay)
    expect(document.querySelector('.when .numeral')?.textContent).toBe('3:30')
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
      'Jonathan Ve Vance in a white shirt and Neeha Shaitus in a blue dress, standing together outdoors, shown from head to mid-leg.',
      'Neeha Shaitus in a green dress and Jonathan Ve Vance in a pink striped shirt, standing in a garden.',
    ])
    expect(images[0].getAttribute('src')).toContain('portrait-1066.jpg')
    expect(images[1].getAttribute('src')).toContain('hero-1200.jpg')
    expect(images[0]).toHaveAttribute('width', '1066')
    expect(images[0]).toHaveAttribute('height', '1600')
    expect(images[1]).toHaveAttribute('width', '1200')
    expect(images[1]).toHaveAttribute('height', '1600')
    expect(images[0]).toHaveAttribute('loading', 'eager')
    expect(images[1]).toHaveAttribute('loading', 'lazy')
    expect(screen.getByRole('heading', { name: 'Jonathan Ve Vance and Neeha Shaitus' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Until the ceremony' })).toBeInTheDocument()
    expect(screen.getByText('See you there')).toBeInTheDocument()
    expect(document.querySelector('.sign')?.textContent?.replace(/\s+/g, ' ').trim()).toBe('Jonathan & Neeha')
    expect(screen.getAllByText('Philips Pavilion')).toHaveLength(2)
    expect(screen.getByText('Indoor AC hall')).toBeInTheDocument()
    expect(screen.getByText('Outdoor space')).toBeInTheDocument()
    expect(screen.queryByText(/Indoors/)).not.toBeInTheDocument()
    expect(screen.queryByText(/same venue/)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /rsvp/i })).not.toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(
      /two are better|ecclesiastes|music is omitted|draft preview|end time is not set|yet to get|still unsettled|to be confirmed|placeholder|stock/i,
    )
    const invite = screen.getByText(
      'Together with their families, Jonathan and Neeha joyfully invite you to celebrate their wedding.',
    )
    const verse = screen.getByText('I have found the one whom my soul loves.')
    expect(screen.getByText('Song of Solomon 3:4')).toBeInTheDocument()
    const date = document.querySelector('.hero-band .date')!
    const countdown = screen.getByRole('heading', { name: 'Until the ceremony' })
    const following = Node.DOCUMENT_POSITION_FOLLOWING
    const ceremony = document.querySelector('.when')!
    const day = screen.getByText('The day')
    const venue = screen.getByRole('heading', { name: 'Venue' })
    const close = screen.getByText('See you there')
    expect(screen.getByRole('button', { name: 'Scroll' })).toBeInTheDocument()
    expect(screen.getByText('Counting the days')).toBeInTheDocument()
    expect(document.querySelectorAll('.date')).toHaveLength(1)
    expect(images[0].compareDocumentPosition(date) & following).toBeTruthy()
    expect(date.compareDocumentPosition(verse) & following).toBeTruthy()
    expect(verse.compareDocumentPosition(invite) & following).toBeTruthy()
    expect(invite.compareDocumentPosition(day) & following).toBeTruthy()
    expect(day.compareDocumentPosition(ceremony) & following).toBeTruthy()
    expect(ceremony.compareDocumentPosition(images[1]) & following).toBeTruthy()
    expect(images[1].compareDocumentPosition(countdown) & following).toBeTruthy()
    expect(countdown.compareDocumentPosition(venue) & following).toBeTruthy()
    expect(venue.compareDocumentPosition(close) & following).toBeTruthy()
  })
})
