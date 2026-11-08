import { readFileSync } from 'node:fs'
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

describe('music', () => {
  function audio() {
    const element = document.querySelector('audio')
    if (!(element instanceof HTMLAudioElement)) throw new Error('missing audio')
    return element
  }

  it('does not play on load, and skip stays silent', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<App />)
    const element = audio()
    expect(element.paused).toBe(true)
    expect(element.preload).toBe('none')
    expect(element).toHaveAttribute('loop')
    expect(element.getAttribute('src')).toMatch(/audio\/painted-woods-in-autumn\.mp3$/)
    expect(element.getAttribute('src')).not.toMatch(/^https?:/i)
    const toggle = screen.getByRole('button', { name: 'Play music' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(toggle.closest('.draft-bar')).toBeNull()
    expect(toggle.querySelector('.music-mark')?.getAttribute('width')).toBe('28')
    expect(eventConfig.gate.openLabel).toBe('Open invitation')
    expect(toggle.querySelector('.music-mark path')?.getAttribute('d')).toBe(
      'M9 17.5a2.5 2.5 0 1 1-2-2.45V6.2l10-2v9.35a2.5 2.5 0 1 1-2-2.45V7.1l-6 1.2v9.2z',
    )
    expect(play).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: eventConfig.gate.skipLabel }))
    expect(play).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Play music' })).toBeInTheDocument()
  })

  it('starts on open, pauses without rewinding, and resumes from the same place', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function playNow(this: HTMLMediaElement) {
      this.dispatchEvent(new Event('play'))
      return Promise.resolve()
    })
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function pauseNow(this: HTMLMediaElement) {
      this.dispatchEvent(new Event('pause'))
    })
    const user = userEvent.setup()
    render(<App />)
    const element = audio()

    await user.click(screen.getByRole('button', { name: eventConfig.gate.openLabel }))
    expect(play).toHaveBeenCalledTimes(1)
    expect(element.volume).toBeCloseTo(0.35)
    expect(screen.getByRole('button', { name: 'Turn music off' })).toHaveAttribute('aria-pressed', 'true')

    element.currentTime = 12
    await user.click(screen.getByRole('button', { name: 'Turn music off' }))
    expect(pause).toHaveBeenCalled()
    expect(element.currentTime).toBe(12)
    expect(screen.getByRole('button', { name: 'Play music' })).toHaveAttribute('aria-pressed', 'false')

    await user.click(screen.getByRole('button', { name: 'Play music' }))
    expect(element.currentTime).toBe(12)
    expect(screen.getByRole('button', { name: 'Turn music off' })).toHaveFocus()
  })

  it('keeps Play music when the browser rejects playback, and still opens', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(new DOMException('NotAllowedError'))
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: eventConfig.gate.openLabel }))
    expect(screen.getByRole('button', { name: 'Play music' })).toHaveAttribute('aria-pressed', 'false')
    expect(document.querySelector('.envelope.is-opening, .invitation')).not.toBeNull()
  })

  it('survives a missing audio file and can be used from the keyboard', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function playNow(this: HTMLMediaElement) {
      this.dispatchEvent(new Event('play'))
      return Promise.resolve()
    })
    const user = userEvent.setup()
    render(<App />)
    audio().dispatchEvent(new Event('error'))
    expect(screen.getByRole('button', { name: 'Play music' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: eventConfig.gate.openLabel })).toBeInTheDocument()

    const toggle = screen.getByRole('button', { name: 'Play music' })
    toggle.focus()
    await user.keyboard('{Enter}')
    expect(play).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Turn music off' })).toHaveFocus()
  })

  it('does not restart music after it was turned off', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function playNow(this: HTMLMediaElement) {
      this.dispatchEvent(new Event('play'))
      return Promise.resolve()
    })
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function pauseNow(this: HTMLMediaElement) {
      this.dispatchEvent(new Event('pause'))
    })
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Play music' }))
    await user.click(screen.getByRole('button', { name: 'Turn music off' }))
    play.mockClear()
    await user.click(screen.getByRole('button', { name: eventConfig.gate.openLabel }))
    expect(play).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Play music' })).toBeInTheDocument()
  })

  it('keeps the control fixed at the bottom right, including the mobile safe area', () => {
    const css = readFileSync('src/index.css', 'utf8')
    const rule = css.match(/\.music-toggle \{[^}]+\}/)?.[0] ?? ''
    expect(rule).toContain('position: fixed')
    expect(rule).toContain('right: max(0.85rem, env(safe-area-inset-right))')
    expect(rule).toContain('bottom: max(0.85rem, env(safe-area-inset-bottom))')
    expect(rule).toContain('width: 64px')
    expect(rule).toContain('height: 64px')
    expect(rule).toContain('border-radius: 18px')
    expect(rule).not.toContain('border-radius: 999px')
    expect(css).not.toContain('.draft-bar .music-toggle')
  })
})
