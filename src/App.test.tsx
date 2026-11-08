import { readFileSync } from 'node:fs'
import { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App, { OPEN_MS } from './App.tsx'
import { eventConfig } from './config/event.ts'
import { setReducedMotion } from './test/matchMedia.ts'

const headingName = 'Jonathan Ve Vance and Neeha Shaitus'

describe('envelope gate', () => {
  it('starts on the envelope alone and keeps the open control in tab order', async () => {
    const user = userEvent.setup()
    render(<App />)
    const open = screen.getByRole('button', { name: eventConfig.gate.openLabel })
    expect(open).toHaveAttribute('id', 'open-invitation')
    expect(open.querySelector('.envelope')).not.toBeNull()
    expect(open.querySelector('.closure .seal')).not.toBeNull()
    expect(open.querySelector('.closure .ribbon')).not.toBeNull()
    expect(open.querySelector('.flap .ribbon')).toBeNull()
    expect(open.querySelector('.pocket .ribbon')).toBeNull()
    const sheet = open.querySelector('.riser rect')
    expect(sheet).not.toBeNull()
    expect(Number(sheet?.getAttribute('width'))).toBeGreaterThan(860)
    expect(Number(sheet?.getAttribute('y'))).toBeLessThan(650)
    expect(Number(sheet?.getAttribute('y')) + Number(sheet?.getAttribute('height'))).toBeGreaterThan(1200)
    const clip = open.querySelector('#sheet-clip rect')
    expect(Number(clip?.getAttribute('y')) + Number(clip?.getAttribute('height'))).toBeLessThanOrEqual(1240)
    expect(open.querySelector('.riser')?.parentElement?.getAttribute('clip-path')).toBe('url(#sheet-clip)')
    expect(open).toHaveTextContent('Philips Pavilion')
    expect(screen.getByText('Please join us to celebrate')).toBeInTheDocument()
    expect(screen.getByText((_, node) => node?.classList.contains('gate-date') === true && (node.textContent ?? '').replace(/\s+/g, ' ').includes('Monday · 28 December 2026'))).toBeInTheDocument()
    expect(screen.getByText('The venue')).toBeInTheDocument()
    expect(screen.getAllByText('Ramamangalam, Ernakulam').length).toBeGreaterThan(0)
    expect(open).not.toHaveTextContent('IST')
    expect(open).toHaveTextContent(eventConfig.ceremony.timeDisplay)
    expect(open).toHaveTextContent('AC hall')
    expect(open).toHaveTextContent(eventConfig.reception.timeDisplay)
    expect(open).toHaveTextContent('Outdoor space')
    expect(open).not.toHaveTextContent('Indoors')
    expect(open).not.toHaveTextContent('Two are better than one')
    expect(open).not.toHaveTextContent('Ecclesiastes')
    expect(screen.queryByText(/Draft preview/)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: headingName })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /skip/i })).not.toBeInTheDocument()
    expect(screen.queryByText('See you there')).not.toBeInTheDocument()
    expect(document.querySelector('.gate-card')).toBeNull()
    expect(open).not.toHaveFocus()
    await user.tab()
    expect(open).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Play music' })).toHaveFocus()
  })

  it('opens from the keyboard without waiting when motion is reduced', async () => {
    setReducedMotion(true)
    const user = userEvent.setup()
    render(<App />)
    expect(document.documentElement.dataset.motion).toBe('reduce')
    await user.tab()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { level: 1, name: headingName })).toHaveFocus()
    expect(screen.getByText('See you there')).toBeInTheDocument()
    expect(document.querySelector('.envelope')).toBeNull()
  })

  it('opens the envelope from the keyboard', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function playNow(this: HTMLMediaElement) {
      this.dispatchEvent(new Event('play'))
      return Promise.resolve()
    })
    const user = userEvent.setup()
    render(<App />)
    const open = screen.getByRole('button', { name: eventConfig.gate.openLabel })
    await user.tab()
    expect(open).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(play).toHaveBeenCalledTimes(1)
    expect(document.querySelector('.envelope-wrap.is-opening')).not.toBeNull()
    expect(screen.queryByText('See you there')).not.toBeInTheDocument()
  })

  it('holds the invitation back until the layered open motion finishes', async () => {
    vi.useFakeTimers()
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: eventConfig.gate.openLabel }))
    expect(document.querySelector('.envelope-wrap.is-opening .riser')).not.toBeNull()
    expect(document.querySelector('.flap')).not.toBeNull()
    expect(document.querySelector('.pocket')).not.toBeNull()
    expect(screen.queryByText('See you there')).not.toBeInTheDocument()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(OPEN_MS - 1)
    })
    expect(screen.queryByText('See you there')).not.toBeInTheDocument()
    expect(document.querySelector('.envelope')).not.toBeNull()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })
    expect(screen.getByText('See you there')).toBeInTheDocument()
    expect(document.querySelector('.envelope')).toBeNull()
    expect(screen.getByRole('heading', { level: 1, name: headingName })).toHaveFocus()
  })

  it('ignores a second open click while the envelope is already opening', async () => {
    vi.useFakeTimers()
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function playNow(this: HTMLMediaElement) {
      this.dispatchEvent(new Event('play'))
      return Promise.resolve()
    })
    render(<App />)
    const open = screen.getByRole('button', { name: eventConfig.gate.openLabel })
    fireEvent.click(open)
    fireEvent.click(open)
    expect(play).toHaveBeenCalledTimes(1)
    expect(document.querySelectorAll('.envelope-wrap.is-opening')).toHaveLength(1)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(OPEN_MS)
    })
    expect(screen.getByText('See you there')).toBeInTheDocument()
  })
})

describe('music', () => {
  function audio() {
    const element = document.querySelector('audio')
    if (!(element instanceof HTMLAudioElement)) throw new Error('missing audio')
    return element
  }

  it('does not play on load', () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
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
    const css = readFileSync('src/index.css', 'utf8')
    expect(css).toMatch(/\.envelope-open:focus,\s*\.envelope-open:focus-visible \{\s*outline: none;/)
    expect(css).toMatch(/\.envelope-open:focus-visible \.open-cue/)
    expect(css).toContain('closure-fade')
    expect(css).toContain('font-family: "Bodoni Moda"')
    expect(css).toContain('font-family: "Cormorant Garamond"')
    expect(css).toContain('font-family: "Great Vibes"')
    expect(toggle.querySelector('.music-mark path')?.getAttribute('d')).toBe(
      'M9 17.5a2.5 2.5 0 1 1-2-2.45V6.2l10-2v9.35a2.5 2.5 0 1 1-2-2.45V7.1l-6 1.2v9.2z',
    )
    expect(play).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: /skip/i })).not.toBeInTheDocument()
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
    expect(document.querySelector('.envelope-wrap.is-opening, .invitation')).not.toBeNull()
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
