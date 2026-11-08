import type { RefObject } from 'react'
import { eventConfig } from '../config/event.ts'
import { CoupleHeading } from './CoupleHeading.tsx'

type EnvelopeGateProps = {
  opening: boolean
  openButtonRef: RefObject<HTMLButtonElement | null>
  onOpen: () => void
  onSkip: () => void
}

export function EnvelopeGate({ opening, openButtonRef, onOpen, onSkip }: EnvelopeGateProps) {
  const { partnerA, partnerB } = eventConfig.couple
  return (
    <main className="gate">
      <div className="gate-body">
        <div className="envelope-wrap">
          <div className={opening ? 'envelope is-opening' : 'envelope'} aria-hidden="true">
            <div className="flap" />
            <div className="pocket" />
            <div className="seal">
              <span>{partnerA.initial}</span>
              <span className="seal-rule" />
              <span>{partnerB.initial}</span>
            </div>
          </div>
        </div>
        <div className="gate-card">
          <p className="eyebrow">{eventConfig.gate.kicker}</p>
          <CoupleHeading />
          <p className="date">{eventConfig.when.display}</p>
          <p className="tz">{eventConfig.when.timezoneLabel}</p>
          <div className="actions">
            <button type="button" id="open-invitation" className="button" ref={openButtonRef} onClick={onOpen}>
              {eventConfig.gate.openLabel}
            </button>
            <button type="button" id="skip-envelope" className="button button-quiet" onClick={onSkip}>
              {eventConfig.gate.skipLabel}
            </button>
          </div>
          <p className="hint">{eventConfig.gate.hint}</p>
        </div>
      </div>
    </main>
  )
}
