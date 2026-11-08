import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { eventConfig } from '../config/event.ts'
import { Invitation } from './Invitation.tsx'

const target = new Date('2026-12-28T15:30:00+05:30')

describe('invitation details', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockImplementation((value) => {
      captured = value as Blob
      return 'blob:mock'
    })
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

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

  it('downloads the ceremony file only after the calendar button is clicked', async () => {
    const user = userEvent.setup()
    const downloads: string[] = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function click(this: HTMLAnchorElement) {
      downloads.push(this.download)
    })
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    render(<Invitation now={new Date('2026-11-07T12:00:00+05:30')} />)
    expect(URL.createObjectURL).not.toHaveBeenCalled()
    expect(document.querySelector('form, input, textarea, select, audio, iframe, a')).toBeNull()
    expect(screen.getByRole('button', { name: eventConfig.map.disabledLabel })).toBeDisabled()
    expect(screen.getByText(eventConfig.rsvp.note)).toBeInTheDocument()
    expect(screen.getByText(/Draft preview/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: eventConfig.calendar.buttonLabel }))

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
    expect(downloads).toEqual([eventConfig.calendar.filename])
    expect(captured).toBeInstanceOf(Blob)
    const text = await captured?.text()
    expect(text).toContain('DTSTART:20261228T100000Z')
    expect(text).toContain('DTEND:20261228T110000Z')
    expect(text).not.toContain('6:30')
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(document.querySelector('form, input, textarea, select, audio, iframe')).toBeNull()
  })

  it('does not download when the calendar config cannot be written', async () => {
    const user = userEvent.setup()
    render(
      <Invitation
        config={{
          ...eventConfig,
          calendar: { ...eventConfig.calendar, filename: '../nope.ics' },
        }}
      />,
    )
    await user.click(screen.getByRole('button', { name: eventConfig.calendar.buttonLabel }))
    expect(URL.createObjectURL).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(eventConfig.calendar.errorMessage)
  })
})

let captured: Blob | null = null
