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
    timeDisplay: string
    placeDisplay: string
    note: string
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
    embedUrl: string
    showLabel: string
    hideLabel: string
    title: string
    note: string
  }
  stock: {
    note: string
  }
}

const ceremonyStartIso = '2026-12-28T15:30:00+05:30'
const ceremonyEndIso = '2026-12-28T16:30:00+05:30'

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
    timeDisplay: 'From 6:30 PM IST',
    placeDisplay: 'Philip Pavilion, outdoors',
    note: 'Outdoors at Philip Pavilion. An end time is not set.',
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
    supporting:
      'What is confirmed for the day is written below. Anything still unsettled is labeled plainly.',
    scheduleHeading: 'The day',
  },
  venue: {
    heading: 'Venue',
    note: 'The ceremony is in the AC hall at Philip Pavilion. The reception is outdoors at the same venue.',
  },
  map: {
    directionsLabel: 'Get directions',
    directionsUrl: 'https://maps.app.goo.gl/6DUQjm4gRWES4AgY6?g_st=ic',
    embedUrl:
      'https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sWGW2%2B4C+Philips+pavilion,+Memury,+Keralam+686663',
    showLabel: 'Show map',
    hideLabel: 'Hide map',
    title: 'Map of Philip Pavilion in Memury',
    note: 'Get directions opens Philip Pavilion in Google Maps. The map stays off this page until you choose Show map.',
  },
  stock: {
    note: 'Temporary stock imagery. These photographs are not Jonathan and Neeha, and the evening scene is not Philip Pavilion.',
  },
} satisfies EventConfig

export function coupleLabel(config: EventConfig = eventConfig): string {
  return `${config.couple.partnerA.display} ${config.couple.conjunction} ${config.couple.partnerB.display}`
}
