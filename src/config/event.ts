/**
 * Confirmed facts for this invitation draft.
 * Edit this file to update names, times, and wording.
 * The ceremony and the reception are both at Philip Pavilion in Memury.
 * Directions use the supplied Google Maps link. Do not replace that link
 * or invent another pin. The embed address is the no-key map Google
 * returned for that same link.
 * The noscript paragraph in index.html repeats the ceremony facts for
 * browsers without JavaScript. Update that sentence with these facts.
 */

export type PersonName = {
  display: string
  initial: string
}

export type EventConfig = {
  couple: {
    partnerA: PersonName
    partnerB: PersonName
    conjunction: string
  }
  when: {
    display: string
    timezone: 'Asia/Kolkata'
    timezoneLabel: string
  }
  ceremony: {
    title: string
    venueName: string
    locality: string
    room: string
    startIso: string
    endIso: string
    timeDisplay: string
    placeDisplay: string
    note: string
  }
  reception: {
    title: string
    startIso: string
    endIso: string
    timeDisplay: string
    placeDisplay: string
  }
  countdown: {
    targetIso: string
    heading: string
    expiredMessage: string
    lessThanSecondMessage: string
    invalidMessage: string
  }
  gate: {
    kicker: string
    openLabel: string
  }
  copy: {
    invitation: string
    supporting: string
    scheduleHeading: string
  }
  venue: {
    heading: string
    note: string
  }
  map: {
    directionsLabel: string
    directionsUrl: string
  }
}

const ceremonyStartIso = '2026-12-28T15:30:00+05:30'
const ceremonyEndIso = '2026-12-28T16:30:00+05:30'
const receptionStartIso = '2026-12-28T18:30:00+05:30'
const receptionEndIso = '2026-12-28T21:30:00+05:30'

export const eventConfig = {
  couple: {
    partnerA: { display: 'Jonathan Ve Vance', initial: 'J' },
    partnerB: { display: 'Neeha Shaitus', initial: 'N' },
    conjunction: 'and',
  },
  when: {
    display: 'Monday, 28 December 2026',
    timezone: 'Asia/Kolkata',
    timezoneLabel: 'India Standard Time · Asia/Kolkata',
  },
  ceremony: {
    title: 'Ceremony',
    venueName: 'Philip Pavilion',
    locality: 'Memury',
    room: 'AC hall',
    startIso: ceremonyStartIso,
    endIso: ceremonyEndIso,
    timeDisplay: '3:30–4:30 PM IST',
    placeDisplay: 'Philip Pavilion, Memury',
    note: 'In the AC hall.',
  },
  reception: {
    title: 'Reception',
    startIso: receptionStartIso,
    endIso: receptionEndIso,
    timeDisplay: '6:30–9:30 PM IST',
    placeDisplay: 'Philip Pavilion, outdoors',
  },
  countdown: {
    targetIso: ceremonyStartIso,
    heading: 'Until the ceremony',
    expiredMessage: 'The ceremony time has passed.',
    lessThanSecondMessage: 'Less than a second remains before the ceremony.',
    invalidMessage: 'The ceremony time could not be read from the event config.',
  },
  gate: {
    kicker: 'Wedding invitation',
    openLabel: 'Open invitation',
  },
  copy: {
    invitation: 'You are warmly invited to celebrate their marriage.',
    supporting: 'The ceremony is in the AC hall. The reception is outdoors at the same venue.',
    scheduleHeading: 'The day',
  },
  venue: {
    heading: 'Venue',
    note: 'The ceremony is in the AC hall at Philip Pavilion. The reception is outdoors at the same venue.',
  },
  map: {
    directionsLabel: 'Get directions',
    directionsUrl: 'https://maps.app.goo.gl/6DUQjm4gRWES4AgY6?g_st=ic',
  },
} satisfies EventConfig

export function coupleLabel(config: EventConfig = eventConfig): string {
  return `${config.couple.partnerA.display} ${config.couple.conjunction} ${config.couple.partnerB.display}`
}
