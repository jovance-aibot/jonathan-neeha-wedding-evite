// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { eventConfig } from './event.ts'

describe('confirmed event facts', () => {
  it('labels the public preview as a draft without calling it private', () => {
    expect(eventConfig.draft.label).toBe('Draft preview — not final')
    expect(`${eventConfig.draft.label} ${eventConfig.draft.detail}`.toLowerCase()).not.toContain('private')
    expect(eventConfig.draft.detail.toLowerCase()).not.toContain('not published')
    expect(eventConfig.rsvp.note.toLowerCase()).not.toContain('private')
    expect(eventConfig.calendar.description.toLowerCase()).not.toContain('private')
  })

  it('names the couple and the ceremony day', () => {
    expect(eventConfig.couple.partnerA.display).toBe('Jonathan Ve Vance')
    expect(eventConfig.couple.partnerB.display).toBe('Neeha Shaitus')
    expect(eventConfig.couple.partnerA.initial).toBe('J')
    expect(eventConfig.couple.partnerB.initial).toBe('N')
    expect(eventConfig.when.display).toBe('Monday, 28 December 2026')
    expect(eventConfig.when.timezone).toBe('Asia/Kolkata')
  })

  it('keeps the ceremony clock and the countdown on the same instant', () => {
    expect(eventConfig.ceremony.startIso).toBe('2026-12-28T15:30:00+05:30')
    expect(eventConfig.ceremony.endIso).toBe('2026-12-28T16:30:00+05:30')
    expect(eventConfig.countdown.targetIso).toBe(eventConfig.ceremony.startIso)
    expect(eventConfig.ceremony.venueName).toBe('Philips Pavilion')
    expect(eventConfig.ceremony.locality).toBe('Memury')
    expect(eventConfig.ceremony.room).toBe('AC hall')
    const start = new Date(eventConfig.ceremony.startIso)
    const end = new Date(eventConfig.ceremony.endIso)
    expect(end.getTime() - start.getTime()).toBe(60 * 60 * 1000)
  })

  it('does not treat the reception place as confirmed', () => {
    expect(eventConfig.reception.locationStatus).toBe('awaiting-confirmation')
    expect(eventConfig.reception.note.toLowerCase()).toContain('awaiting confirmation')
    expect(eventConfig.reception.placeDisplay).toBe('Outdoors')
    expect(eventConfig.venue.note.toLowerCase()).not.toContain('same venue')
    expect(eventConfig.map.enabled).toBe(false)
  })

  it('uses a safe ceremony calendar filename', () => {
    expect(eventConfig.calendar.filename).toBe('jonathan-neeha-ceremony-2026-12-28.ics')
    expect(eventConfig.calendar.filename).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*\.ics$/)
  })
})
