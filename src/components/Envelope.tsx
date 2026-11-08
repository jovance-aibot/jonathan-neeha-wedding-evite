import type { RefObject } from 'react'
import { eventConfig } from '../config/event.ts'
import { CoupleHeading } from './CoupleHeading.tsx'

type EnvelopeGateProps = {
  opening: boolean
  openButtonRef: RefObject<HTMLButtonElement | null>
  onOpen: () => void
  onSkip: () => void
  onRecedeEnd: () => void
}

export function EnvelopeGate({ opening, openButtonRef, onOpen, onSkip, onRecedeEnd }: EnvelopeGateProps) {
  const { partnerA, partnerB } = eventConfig.couple
  return (
    <main className="gate">
      <div className="gate-body">
        <div
          className={opening ? 'envelope-wrap is-opening' : 'envelope-wrap'}
          onAnimationEnd={(event) => {
            if (event.animationName !== 'envelope-recede') return
            if (event.target !== event.currentTarget) return
            onRecedeEnd()
          }}
        >
          <div className="envelope" aria-hidden="true">
            <div className="env-back" />
            <div className="riser">
              <p className="riser-mark">
                <span>{partnerA.initial}</span>
                <span className="amp">&amp;</span>
                <span>{partnerB.initial}</span>
              </p>
              <p className="riser-names">
                {partnerA.display} and {partnerB.display}
              </p>
              <p className="riser-date">{eventConfig.when.display}</p>
            </div>
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
