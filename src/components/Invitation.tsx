import { useEffect, useState } from 'react'
import type { Ref } from 'react'
import { eventConfig as defaultConfig, type EventConfig } from '../config/event.ts'
import { CoupleHeading } from './CoupleHeading.tsx'
import { getCountdown, unitWord } from '../lib/countdown.ts'

type InvitationProps = {
  config?: EventConfig
  now?: Date
  headingRef?: Ref<HTMLHeadingElement>
}

const base = import.meta.env.BASE_URL

export function Invitation({ config = defaultConfig, now, headingRef }: InvitationProps) {
  return (
    <main className="story">
      <article className="story-inner">
        <header className="story-open">
          <p className="kicker">Please join us to celebrate</p>
          <CoupleHeading config={config} headingRef={headingRef} focusable />
          <p className="date">{config.when.display}</p>
        </header>
        <CountdownBlock config={config} now={now} />
        <PhotoFigure
          name="couple"
          width={1200}
          height={800}
          eager
          alt="A couple seen from behind, walking at sunset."
        />
        <section className="times" aria-label="Schedule">
          <div className="time-block">
            <h2>{config.ceremony.title}</h2>
            <p className="when">{config.ceremony.timeDisplay}</p>
            <p className="sub">Indoors · {config.ceremony.room}</p>
          </div>
          <div className="time-block">
            <h2>{config.reception.title}</h2>
            <p className="when">{config.reception.timeDisplay}</p>
            <p className="sub">Outdoors · same venue</p>
          </div>
        </section>
        <PhotoFigure name="rings" width={1200} height={800} alt="Hands with wedding rings." />
        <VenueBlock config={config} />
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

function PhotoFigure({
  name,
  width,
  height,
  alt,
  eager = false,
}: {
  name: string
  width: number
  height: number
  alt: string
  eager?: boolean
}) {
  const src = (kind: 'avif' | 'webp', size: 720 | 1200) => `${base}photos/${name}-${size}.${kind}`
  return (
    <figure className="photo">
      <picture>
        <source type="image/avif" srcSet={`${src('avif', 720)} 720w, ${src('avif', 1200)} 1200w`} sizes="(min-width: 800px) 40rem, 100vw" />
        <source type="image/webp" srcSet={`${src('webp', 720)} 720w, ${src('webp', 1200)} 1200w`} sizes="(min-width: 800px) 40rem, 100vw" />
        <img
          src={src('webp', 1200)}
          width={width}
          height={height}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </picture>
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
