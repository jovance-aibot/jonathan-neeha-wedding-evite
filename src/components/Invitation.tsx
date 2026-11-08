import { useEffect, useState } from 'react'
import type { Ref } from 'react'
import { eventConfig as defaultConfig, type EventConfig } from '../config/event.ts'
import { parseDateDisplay } from '../lib/dateDisplay.ts'
import { CoupleHeading } from './CoupleHeading.tsx'
import { getCountdown, unitWord } from '../lib/countdown.ts'

type InvitationProps = {
  config?: EventConfig
  now?: Date
  headingRef?: Ref<HTMLHeadingElement>
}

const base = import.meta.env.BASE_URL

export function TimeRange({ value }: { value: string }) {
  const match = value.match(/^(.*?)\s-\s(.*)$/)
  if (!match) return value
  return (
    <>
      <span className="numeral">{match[1]}</span>
      <span className="time-sep"> - </span>
      <span className="numeral">{match[2]}</span>
    </>
  )
}

export function DateParts({ display }: { display: string }) {
  const parts = parseDateDisplay(display)
  if (!parts) return display
  return (
    <>
      <span className="date-word">{parts.weekday}</span>
      <span className="date-sep"> · </span>
      <span className="numeral">{parts.day}</span>{' '}
      <span className="date-word">{parts.month}</span>{' '}
      <span className="numeral">{parts.year}</span>
    </>
  )
}

const portraitAlt = 'Jonathan Ve Vance and Neeha Shaitus standing together outdoors, shown from head to mid-leg.'

export function Invitation({ config = defaultConfig, now, headingRef }: InvitationProps) {
  return (
    <main className="story">
      <article className="story-inner">
        <header className="hero">
          <div className="hero-photo">
            <Portrait eager overlay alt={portraitAlt} />
            <div className="hero-title">
              <p className="kicker join-line">Please join us to celebrate</p>
              <CoupleHeading config={config} headingRef={headingRef} focusable />
            </div>
          </div>
          <p className="date">
            <DateParts display={config.when.display} />
          </p>
        </header>
        <CountdownBlock config={config} now={now} />
        <div className="day">
          <section className="times" aria-label="Schedule">
            <div className="time-block">
              <h2>{config.ceremony.title}</h2>
              <p className="when">
                <TimeRange value={config.ceremony.timeDisplay} />
              </p>
              <p className="sub">{config.ceremony.room}</p>
            </div>
            <div className="time-block">
              <h2>{config.reception.title}</h2>
              <p className="when">
                <TimeRange value={config.reception.timeDisplay} />
              </p>
              <p className="sub">Outdoor space</p>
            </div>
          </section>
          <Portrait className="portrait-again" alt="The same photograph of Jonathan Ve Vance and Neeha Shaitus." />
          <VenueBlock config={config} />
        </div>
        <footer className="close">
          <p className="close-lead">We would love to celebrate with you</p>
          <p className="see">See you there</p>
          <p className="sign">
            {config.couple.partnerA.display.split(' ')[0]} <span className="amp">&amp;</span>{' '}
            {config.couple.partnerB.display.split(' ')[0]}
          </p>
        </footer>
      </article>
    </main>
  )
}

function Portrait({
  alt,
  eager = false,
  overlay = false,
  className = '',
}: {
  alt: string
  eager?: boolean
  overlay?: boolean
  className?: string
}) {
  const full = `${base}photos/portrait-1066.webp`
  const small = `${base}photos/portrait-640.webp`
  return (
    <figure className={className ? `portrait ${className}` : 'portrait'}>
      <div className="portrait-media">
        <picture>
          <source type="image/webp" srcSet={`${small} 640w, ${full} 1066w`} sizes="(min-width: 800px) 28rem, 92vw" />
          <img
            src={`${base}photos/portrait-1066.jpg`}
            width={1066}
            height={1600}
            alt={alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        </picture>
        {overlay ? <div className="hero-shade" aria-hidden="true" /> : null}
      </div>
    </figure>
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
    <section className="countdown" aria-labelledby="countdown-heading">
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

function VenueBlock({ config }: { config: EventConfig }) {
  return (
    <section className="venue" aria-labelledby="venue-heading">
      <h2 id="venue-heading">{config.venue.heading}</h2>
      <p className="venue-name">{config.ceremony.venueName}</p>
      <p className="venue-locality">{config.ceremony.locality}</p>
      <div className="stack-actions">
        <a className="button" href={config.map.directionsUrl} target="_blank" rel="noopener noreferrer">
          {config.map.directionsLabel}
        </a>
      </div>
    </section>
  )
}
