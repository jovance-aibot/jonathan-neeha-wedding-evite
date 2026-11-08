import type { RefObject } from 'react'
import { eventConfig } from '../config/event.ts'

type EnvelopeGateProps = {
  opening: boolean
  openButtonRef: RefObject<HTMLButtonElement | null>
  onOpen: () => void
  onRecedeEnd: () => void
}

export function EnvelopeGate({ opening, openButtonRef, onOpen, onRecedeEnd }: EnvelopeGateProps) {
  const { partnerA, partnerB } = eventConfig.couple
  return (
    <main className="gate">
      <div className="gate-body">
        <button
          type="button"
          id="open-invitation"
          className="envelope-open"
          ref={openButtonRef}
          aria-label={eventConfig.gate.openLabel}
          onClick={onOpen}
        >
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
          <span className="open-cue">{eventConfig.gate.openLabel}</span>
        </button>
      </div>
    </main>
  )
}
