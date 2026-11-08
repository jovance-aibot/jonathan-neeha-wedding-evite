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
  draft: {
    label: string
    detail: string
  }
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
    skipLabel: string
    hint: string
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
    title: string
    note: string
  }
  calendar: {
    filename: string
    buttonLabel: string
    note: string
    errorMessage: string
    prodid: string
    uid: string
    summary: string
    location: string
    description: string
  }
  photos: {
    heading: string
    note: string
    frames: readonly { id: string; label: string }[]
  }
  rsvp: {
    heading: string
    note: string
  }
  notesHeading: string
  placeholders: readonly string[]
}

const ceremonyStartIso = '2026-12-28T15:30:00+05:30'
const ceremonyEndIso = '2026-12-28T16:30:00+05:30'

export const eventConfig = {
  draft: {
    label: 'Draft preview — not final',
    detail: 'Draft preview. The wording is not final, and this page does not collect replies.',
  },
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
    openLabel: 'Open the invitation',
    skipLabel: 'Skip the envelope',
    hint: 'Opening plays a short paper motion. Skip reveals the invitation at once.',
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
    title: 'Map of Philip Pavilion in Memury',
    note: 'Get directions opens Philip Pavilion in Google Maps. The map stays off this page until you choose Show map.',
  },
  calendar: {
    filename: 'jonathan-neeha-ceremony-2026-12-28.ics',
    buttonLabel: 'Download ceremony calendar',
    note: 'The file covers only the ceremony, 3:30–4:30 PM IST. The reception is left out because an end time is not set.',
    errorMessage: 'The ceremony calendar could not be prepared from the event config.',
    prodid: '-//Invitation Draft//Jonathan and Neeha//EN',
    uid: 'ceremony-20261228-jonathan-neeha@draft.invalid',
    summary: 'Ceremony — Jonathan Ve Vance and Neeha Shaitus',
    location: 'Philip Pavilion, Memury — AC hall',
    description:
      'Ceremony in the AC hall at Philip Pavilion, Memury.\n3:30–4:30 PM India Standard Time (Asia/Kolkata).\nDraft preview. The reception is not included.',
  },
  photos: {
    heading: 'Photographs',
    note: 'These frames are empty on purpose. No photographs are included in this draft.',
    frames: [
      { id: 'frame-1', label: 'Frame 1' },
      { id: 'frame-2', label: 'Frame 2' },
      { id: 'frame-3', label: 'Frame 3' },
    ],
  },
  rsvp: {
    heading: 'RSVP',
    note: 'Replies are not collected here. This draft has no response form, and it does not send or store guest details.',
  },
  notesHeading: 'Still open in this draft',
  placeholders: [
    'Photographs have not been added.',
    'No reply path is open.',
    'Music is omitted until a permitted recording is supplied.',
  ],
} satisfies EventConfig

export function coupleLabel(config: EventConfig = eventConfig): string {
  return `${config.couple.partnerA.display} ${config.couple.conjunction} ${config.couple.partnerB.display}`
}
