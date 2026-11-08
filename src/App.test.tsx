import { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App.tsx'
import { eventConfig } from './config/event.ts'
import { setReducedMotion } from './test/matchMedia.ts'

const headingName = 'Jonathan Ve Vance and Neeha Shaitus'

describe('envelope gate', () => {
  it('starts on the envelope, with open focused before skip', async () => {
    const user = userEvent.setup()
    render(<App />)
    const open = screen.getByRole('button', { name: eventConfig.gate.openLabel })
    const skip = screen.getByRole('button', { name: eventConfig.gate.skipLabel })
    expect(screen.getByText(/Draft preview — not final/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: headingName })).toBeInTheDocument()
    expect(screen.queryByText(eventConfig.reception.note)).not.toBeInTheDocument()
    expect(open).toHaveFocus()
    await user.tab()
    expect(skip).toHaveFocus()
  })

  it('opens from the keyboard without waiting when motion is reduced', async () => {
    setReducedMotion(true)
    const user = userEvent.setup()
    render(<App />)
    expect(document.documentElement.dataset.motion).toBe('reduce')
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { level: 1, name: headingName })).toHaveFocus()
    expect(screen.getByText(eventConfig.reception.note)).toBeInTheDocument()
    expect(document.querySelector('.envelope')).toBeNull()
  })

  it('skips the envelope from the keyboard and moves focus to the invitation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.tab()
    await user.keyboard(' ')
    expect(screen.getByRole('heading', { level: 1, name: headingName })).toHaveFocus()
    expect(screen.getByText(eventConfig.ceremony.note)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: eventConfig.gate.openLabel })).not.toBeInTheDocument()
  })

  it('holds the invitation back until the short open motion finishes', async () => {
    vi.useFakeTimers()
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: eventConfig.gate.openLabel }))
    expect(document.querySelector('.envelope.is-opening')).not.toBeNull()
    expect(screen.queryByText(eventConfig.reception.note)).not.toBeInTheDocument()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(719)
    })
    expect(screen.queryByText(eventConfig.reception.note)).not.toBeInTheDocument()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })
    expect(screen.getByText(eventConfig.reception.note)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: headingName })).toHaveFocus()
  })
})
