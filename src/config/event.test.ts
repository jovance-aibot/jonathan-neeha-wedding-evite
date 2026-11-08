// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { eventConfig } from './event.ts'

describe('confirmed event facts', () => {
  it('does not describe the invitation as private or unpublished', () => {
    const published = `${eventConfig.stock.note} ${eventConfig.venue.note} ${eventConfig.map.note}`.toLowerCase()
    expect(published).not.toContain('private')
    expect(published).not.toContain('not published')
    expect(published).not.toContain('rsvp')
    expect('calendar' in eventConfig).toBe(false)
    expect('draft' in eventConfig).toBe(false)
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
    expect(eventConfig.ceremony.venueName).toBe('Philip Pavilion')
    expect(eventConfig.ceremony.locality).toBe('Memury')
    expect(eventConfig.ceremony.room).toBe('AC hall')
    const start = new Date(eventConfig.ceremony.startIso)
    const end = new Date(eventConfig.ceremony.endIso)
    expect(end.getTime() - start.getTime()).toBe(60 * 60 * 1000)
  })

  it('places the ceremony and the reception at Philip Pavilion', () => {
    expect(eventConfig.ceremony.placeDisplay).toBe('Philip Pavilion, Memury')
    expect(eventConfig.reception.placeDisplay).toBe('Philip Pavilion, outdoors')
    expect(eventConfig.reception.note.toLowerCase()).not.toContain('awaiting')
    expect(eventConfig.venue.note.toLowerCase()).toContain('same venue')
    expect(eventConfig.venue.note).toContain('AC hall')
    expect(eventConfig.map.directionsLabel).toBe('Get directions')
    expect(eventConfig.map.directionsUrl).toBe('https://maps.app.goo.gl/6DUQjm4gRWES4AgY6?g_st=ic')
    expect(eventConfig.map.embedUrl).toContain('WGW2%2B4C+Philips+pavilion,+Memury,+Keralam+686663')
    expect(eventConfig.map.embedUrl.startsWith('https://www.google.com/maps/embed?')).toBe(true)
  })

})
