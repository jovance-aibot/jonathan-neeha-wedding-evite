/**
 * Confirmed facts for this invitation draft.
 * Edit this file to update names, times, and wording.
 * The ceremony is the only event with a verified place and end time.
 * Do not fill the reception location, a map pin, photographs, or contact
 * details until those are actually known.
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
    locationStatus: 'awaiting-confirmation'
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
    enabled: false
    disabledLabel: string
    disabledNote: string
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
    venueName: 'Philips Pavilion',
    locality: 'Memury',
    room: 'AC hall',
    startIso: ceremonyStartIso,
    endIso: ceremonyEndIso,
    timeDisplay: '3:30–4:30 PM IST',
    placeDisplay: 'Philips Pavilion, Memury',
    note: 'In the AC hall.',
  },
  reception: {
    title: 'Reception',
    timeDisplay: 'From 6:30 PM IST',
    placeDisplay: 'Outdoors',
    note: 'The location is awaiting confirmation. An end time is not set.',
    locationStatus: 'awaiting-confirmation',
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
    heading: 'Ceremony venue',
    note: 'The ceremony is held in the AC hall. This card is for the ceremony only. The reception is listed on its own, and its location is awaiting confirmation.',
  },
  map: {
    enabled: false,
    disabledLabel: 'Map unavailable',
    disabledNote:
      'A map will appear here after a verified pin is added. This draft does not guess a location.',
  },
  calendar: {
    filename: 'jonathan-neeha-ceremony-2026-12-28.ics',
    buttonLabel: 'Download ceremony calendar',
    note: 'The file covers only the ceremony, 3:30–4:30 PM IST. The reception is left out because its location and end time are not confirmed.',
    errorMessage: 'The ceremony calendar could not be prepared from the event config.',
    prodid: '-//Invitation Draft//Jonathan and Neeha//EN',
    uid: 'ceremony-20261228-jonathan-neeha@draft.invalid',
    summary: 'Ceremony — Jonathan Ve Vance and Neeha Shaitus',
    location: 'Philips Pavilion, Memury — AC hall',
    description:
      'Ceremony in the AC hall at Philips Pavilion, Memury.\n3:30–4:30 PM India Standard Time (Asia/Kolkata).\nDraft preview. The reception is not included.',
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
    'A verified map pin has not been added.',
    'The reception location is awaiting confirmation.',
    'No reply path is open.',
    'Music is omitted until a permitted recording is supplied.',
  ],
} satisfies EventConfig

export function coupleLabel(config: EventConfig = eventConfig): string {
  return `${config.couple.partnerA.display} ${config.couple.conjunction} ${config.couple.partnerB.display}`
}
