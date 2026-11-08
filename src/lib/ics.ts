import type { EventConfig } from '../config/event.ts'

export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\n|\r/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}

export function formatIcsUtc(date: Date): string {
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid calendar instant')
  }
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  )
}

export function foldIcsLine(line: string): string {
  const encoder = new TextEncoder()
  if (encoder.encode(line).length <= 75) return line

  const parts: string[] = []
  let buffer = ''
  let limit = 75

  for (const char of line) {
    const next = buffer + char
    if (encoder.encode(next).length > limit) {
      parts.push(buffer)
      buffer = char
      limit = 74
    } else {
      buffer = next
    }
  }

  if (buffer) parts.push(buffer)
  return parts.map((part, index) => (index === 0 ? part : ` ${part}`)).join('\r\n')
}

function instant(value: string, label: string): Date {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ${label}`)
  }
  return date
}

export function buildCeremonyIcs(config: EventConfig, stamp: Date): string {
  const start = instant(config.ceremony.startIso, 'ceremony start')
  const end = instant(config.ceremony.endIso, 'ceremony end')
  if (end.getTime() <= start.getTime()) {
    throw new Error('Ceremony end must be after the start')
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${config.calendar.prodid}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${config.calendar.uid}`,
    `DTSTAMP:${formatIcsUtc(stamp)}`,
    `DTSTART:${formatIcsUtc(start)}`,
    `DTEND:${formatIcsUtc(end)}`,
    `SUMMARY:${escapeIcsText(config.calendar.summary)}`,
    `LOCATION:${escapeIcsText(config.calendar.location)}`,
    `DESCRIPTION:${escapeIcsText(config.calendar.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return `${lines.map(foldIcsLine).join('\r\n')}\r\n`
}

export function assertDownloadFilename(filename: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.ics$/.test(filename)) {
    throw new Error('Calendar filename is not a safe .ics name')
  }
  return filename
}
