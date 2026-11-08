// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { getCountdown, unitWord } from './countdown.ts'

const targetIso = '2026-12-28T15:30:00+05:30'

describe('getCountdown', () => {
  it('counts a known span in Asia/Kolkata', () => {
    expect(getCountdown(new Date('2026-11-07T00:00:00+05:30'), targetIso)).toEqual({
      status: 'remaining',
      days: 51,
      hours: 15,
      minutes: 30,
      seconds: 0,
      totalSeconds: 51 * 86400 + 15 * 3600 + 30 * 60,
    })
  })

  it('treats the target instant as expired, including its UTC equivalent', () => {
    const expired = {
      status: 'expired',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
    }
    expect(getCountdown(new Date(targetIso), targetIso)).toEqual(expired)
    expect(getCountdown(new Date('2026-12-28T10:00:00Z'), targetIso)).toEqual(expired)
    expect(getCountdown(new Date(new Date(targetIso).getTime() + 1), targetIso)).toEqual(expired)
  })

  it('keeps the final second and the final partial second distinct from expired', () => {
    expect(getCountdown(new Date('2026-12-28T09:59:59Z'), targetIso)).toMatchObject({
      status: 'remaining',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 1,
      totalSeconds: 1,
    })
    const partial = getCountdown(new Date(new Date(targetIso).getTime() - 500), targetIso)
    expect(partial.status).toBe('remaining')
    expect(partial.totalSeconds).toBe(0)
  })

  it('rejects an unreadable clock', () => {
    expect(getCountdown(new Date('nope'), targetIso).status).toBe('invalid')
    expect(getCountdown(new Date(targetIso), 'not-a-date').status).toBe('invalid')
  })
})

describe('unitWord', () => {
  it('uses the singular only for one', () => {
    expect(unitWord(1, 'day', 'days')).toBe('day')
    expect(unitWord(0, 'day', 'days')).toBe('days')
    expect(unitWord(2, 'hour', 'hours')).toBe('hours')
  })
})
