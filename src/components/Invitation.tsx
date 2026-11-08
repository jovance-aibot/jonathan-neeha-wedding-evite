import { useEffect, useState } from 'react'
import type { Ref } from 'react'
import { eventConfig as defaultConfig, type EventConfig } from '../config/event.ts'
import { Sprig, Vine } from './art.tsx'
import { CoupleHeading } from './CoupleHeading.tsx'
import { getCountdown, unitWord } from '../lib/countdown.ts'
import { assertDownloadFilename, buildCeremonyIcs } from '../lib/ics.ts'
import { downloadTextFile } from '../lib/download.ts'

type InvitationProps = {
  config?: EventConfig
  now?: Date
  headingRef?: Ref<HTMLHeadingElement>
}

export function Invitation({ config = defaultConfig, now, headingRef }: InvitationProps) {
  return (
    <main className="invitation">
      <article className="sheet">
        <Sprig className="corner corner-tl" />
        <Sprig className="corner corner-tr" />
        <p className="eyebrow">{config.gate.kicker}</p>
        <p className="monogram" aria-hidden="true">
          <span>{config.couple.partnerA.initial}</span>
          <span className="amp">&amp;</span>
          <span>{config.couple.partnerB.initial}</span>
        </p>
        <CoupleHeading config={config} headingRef={headingRef} focusable />
        <p className="date">{config.when.display}</p>
        <p className="tz">{config.when.timezoneLabel}</p>
        <Vine className="vine" />
        <p className="lede">{config.copy.invitation}</p>
        <p className="supporting">{config.copy.supporting}</p>
        <CountdownBlock config={config} now={now} />
        <ScheduleBlock config={config} />
        <VenueBlock config={config} />
        <PhotosBlock config={config} />
        <RsvpBlock config={config} />
        <NotesBlock config={config} />
      </article>
    </main>
  )
}

function CountdownBlock({ config, now }: { config: EventConfig; now?: Date }) {
  const controlled = now !== undefined
  const [ticking, setTicking] = useState(() => now ?? new Date())

  useEffect(() => {
    if (controlled) return
    const id = window.setInterval(() => setTicking(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [controlled])

  const instant = now ?? ticking
  const parts = getCountdown(instant, config.countdown.targetIso)

  return (
    <section className="block" aria-labelledby="countdown-heading">
      <h2 id="countdown-heading">{config.countdown.heading}</h2>
      {parts.status === 'invalid' ? (
        <p className="alert" role="alert">
          {config.countdown.invalidMessage}
        </p>
      ) : null}
      {parts.status === 'expired' ? <p className="expired">{config.countdown.expiredMessage}</p> : null}
      {parts.status === 'remaining' && parts.totalSeconds === 0 ? (
        <p className="expired">{config.countdown.lessThanSecondMessage}</p>
      ) : null}
      {parts.status === 'remaining' && parts.totalSeconds > 0 ? (
        <ol className="count-grid" aria-label="Time remaining">
          <Count value={parts.days} singular="day" plural="days" />
          <Count value={parts.hours} singular="hour" plural="hours" />
          <Count value={parts.minutes} singular="minute" plural="minutes" />
          <Count value={parts.seconds} singular="second" plural="seconds" />
        </ol>
      ) : null}
    </section>
  )
}

function Count({ value, singular, plural }: { value: number; singular: string; plural: string }) {
  const label = unitWord(value, singular, plural)
  return (
    <li aria-label={`${value} ${label}`}>
      <span className="num">{value}</span>
      <span className="unit">{label}</span>
    </li>
  )
}

function ScheduleBlock({ config }: { config: EventConfig }) {
  return (
    <section className="block" aria-labelledby="schedule-heading">
      <h2 id="schedule-heading">{config.copy.scheduleHeading}</h2>
      <ul className="schedule">
        <li>
          <h3>{config.ceremony.title}</h3>
          <p className="time">{config.ceremony.timeDisplay}</p>
          <p className="place">{config.ceremony.placeDisplay}</p>
          <p className="note">{config.ceremony.note}</p>
        </li>
        <li>
          <h3>{config.reception.title}</h3>
          <p className="time">{config.reception.timeDisplay}</p>
          <p className="place">{config.reception.placeDisplay}</p>
          <p className="note">{config.reception.note}</p>
        </li>
      </ul>
    </section>
  )
}

function VenueBlock({ config }: { config: EventConfig }) {
  const [calendarError, setCalendarError] = useState<string | null>(null)

  function onDownload() {
    try {
      const filename = assertDownloadFilename(config.calendar.filename)
      const ics = buildCeremonyIcs(config, new Date())
      downloadTextFile(ics, filename, 'text/calendar;charset=utf-8')
      setCalendarError(null)
    } catch {
      setCalendarError(config.calendar.errorMessage)
    }
  }

  return (
    <section className="block" aria-labelledby="venue-heading">
      <h2 id="venue-heading">{config.venue.heading}</h2>
      <p className="venue-name">{config.ceremony.venueName}</p>
      <p className="venue-locality">{config.ceremony.locality}</p>
      <p className="note">{config.venue.note}</p>
      <div className="stack-actions">
        <button type="button" className="button" onClick={onDownload}>
          {config.calendar.buttonLabel}
        </button>
        <button
          type="button"
          className="button button-quiet"
          disabled
          aria-describedby="map-note"
        >
          {config.map.disabledLabel}
        </button>
      </div>
      <p className="hint">{config.calendar.note}</p>
      <p id="map-note" className="hint">
        {config.map.disabledNote}
      </p>
      {calendarError ? (
        <p className="alert" role="alert">
          {calendarError}
        </p>
      ) : null}
    </section>
  )
}

function PhotosBlock({ config }: { config: EventConfig }) {
  return (
    <section className="block" aria-labelledby="photos-heading">
      <h2 id="photos-heading">{config.photos.heading}</h2>
      <p className="note">{config.photos.note}</p>
      <div className="frames">
        {config.photos.frames.map((frame) => (
          <figure key={frame.id}>
            <div className="frame" aria-hidden="true">
              <span>Photograph</span>
            </div>
            <figcaption>{frame.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function RsvpBlock({ config }: { config: EventConfig }) {
  return (
    <section className="block" aria-labelledby="rsvp-heading">
      <h2 id="rsvp-heading">{config.rsvp.heading}</h2>
      <p className="rsvp-note">{config.rsvp.note}</p>
    </section>
  )
}

function NotesBlock({ config }: { config: EventConfig }) {
  return (
    <footer className="notes">
      <p>{config.draft.detail}</p>
      <section aria-labelledby="notes-heading">
        <h2 id="notes-heading">{config.notesHeading}</h2>
        <ul>
          {config.placeholders.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <Sprig className="closing-sprig" />
    </footer>
  )
}
