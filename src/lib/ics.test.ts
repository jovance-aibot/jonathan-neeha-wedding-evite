// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { eventConfig } from '../config/event.ts'
import {
  assertDownloadFilename,
  buildCeremonyIcs,
  escapeIcsText,
  foldIcsLine,
  formatIcsUtc,
} from './ics.ts'

function unfold(ics: string): string[] {
  const logical: string[] = []
  for (const line of ics.split('\r\n')) {
    if (line === '') continue
    if ((line.startsWith(' ') || line.startsWith('\t')) && logical.length > 0) {
      logical[logical.length - 1] += line.slice(1)
    } else {
      logical.push(line)
    }
  }
  return logical
}

describe('escapeIcsText', () => {
  it('escapes backslash, newline, semicolon, and comma', () => {
    expect(escapeIcsText('a\\b,c;d\ne')).toBe('a\\\\b\\,c\\;d\\ne')
  })
})

describe('formatIcsUtc', () => {
  it('converts the confirmed ceremony hours to 10:00–11:00Z', () => {
    expect(formatIcsUtc(new Date('2026-12-28T15:30:00+05:30'))).toBe('20261228T100000Z')
    expect(formatIcsUtc(new Date('2026-12-28T16:30:00+05:30'))).toBe('20261228T110000Z')
  })

  it('rejects an invalid instant', () => {
    expect(() => formatIcsUtc(new Date('nope'))).toThrow(/invalid calendar instant/i)
  })
})

describe('foldIcsLine', () => {
  it('folds on 75 octets and keeps the text when unfolded', () => {
    const line = `X:${'a'.repeat(80)}`
    const folded = foldIcsLine(line)
    const physical = folded.split('\r\n')
    expect(physical.length).toBeGreaterThan(1)
    for (const row of physical) {
      expect(new TextEncoder().encode(row).length).toBeLessThanOrEqual(75)
    }
    expect(physical.slice(1).every((row) => row.startsWith(' '))).toBe(true)
    expect(unfold(`${folded}\r\n`)[0]).toBe(line)
  })
})

describe('buildCeremonyIcs', () => {
  const stamp = new Date('2026-11-07T13:52:00Z')
  const ics = buildCeremonyIcs(eventConfig, stamp)
  const logical = unfold(ics)

  it('writes one ceremony event with CRLF lines and escaped text', () => {
    expect(ics.endsWith('\r\n')).toBe(true)
    expect(ics.replace(/\r\n/g, '')).not.toContain('\n')
    for (const row of ics.split('\r\n')) {
      expect(new TextEncoder().encode(row).length).toBeLessThanOrEqual(75)
    }
    expect(logical.filter((line) => line === 'BEGIN:VEVENT')).toHaveLength(1)
    expect(logical).toContain('DTSTAMP:20261107T135200Z')
    expect(logical).toContain('DTSTART:20261228T100000Z')
    expect(logical).toContain('DTEND:20261228T110000Z')
    expect(logical).toContain('SUMMARY:Ceremony — Jonathan Ve Vance and Neeha Shaitus')
    expect(logical).toContain('LOCATION:Philip Pavilion\\, Memury — AC hall')
    expect(logical.some((line) => line.startsWith('DESCRIPTION:') && line.includes('not included'))).toBe(
      true,
    )
    expect(ics).not.toContain('6:30')
    expect(ics).not.toContain('183000')
    expect(ics).not.toContain('130000Z')
    expect(ics).not.toContain('ATTENDEE')
    expect(ics).not.toContain('ORGANIZER')
    expect(ics).not.toContain('RRULE')
    expect(ics).not.toContain('GEO:')
    expect(ics).not.toContain('URL:')
  })

  it('refuses a broken ceremony range', () => {
    expect(() =>
      buildCeremonyIcs(
        { ...eventConfig, ceremony: { ...eventConfig.ceremony, startIso: 'not-a-date' } },
        stamp,
      ),
    ).toThrow(/ceremony start/i)
    expect(() =>
      buildCeremonyIcs(
        { ...eventConfig, ceremony: { ...eventConfig.ceremony, endIso: eventConfig.ceremony.startIso } },
        stamp,
      ),
    ).toThrow(/after the start/i)
  })
})

describe('assertDownloadFilename', () => {
  it('accepts the ceremony filename and rejects paths or other types', () => {
    expect(assertDownloadFilename(eventConfig.calendar.filename)).toBe(eventConfig.calendar.filename)
    expect(() => assertDownloadFilename('../secret.ics')).toThrow(/safe/i)
    expect(() => assertDownloadFilename('notes.txt')).toThrow(/safe/i)
    expect(() => assertDownloadFilename('my file.ics')).toThrow(/safe/i)
  })
})
