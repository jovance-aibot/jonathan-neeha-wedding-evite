import { useEffect, useRef, useState } from 'react'
import { coupleLabel, eventConfig } from './config/event.ts'
import { EnvelopeGate } from './components/Envelope.tsx'
import { Invitation } from './components/Invitation.tsx'
import { usePrefersReducedMotion } from './lib/motion.ts'

type Phase = 'closed' | 'opening' | 'invitation'

const OPEN_MS = 720

export default function App() {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>('closed')
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const revealTimer = useRef<number | null>(null)
  const revealed = useRef(false)

  useEffect(() => {
    document.title = `${coupleLabel()} — draft preview`
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduce' : 'full'
  }, [reduced])

  useEffect(() => {
    if (phase === 'closed') openButtonRef.current?.focus()
  }, [phase])

  useEffect(() => {
    if (phase === 'invitation') headingRef.current?.focus()
  }, [phase])

  useEffect(() => {
    return () => {
      if (revealTimer.current !== null) window.clearTimeout(revealTimer.current)
    }
  }, [])

  function reveal() {
    if (revealed.current) return
    revealed.current = true
    if (revealTimer.current !== null) {
      window.clearTimeout(revealTimer.current)
      revealTimer.current = null
    }
    setPhase('invitation')
  }

  function openInvitation() {
    if (revealed.current || phase === 'opening') return
    if (reduced) {
      reveal()
      return
    }
    setPhase('opening')
    revealTimer.current = window.setTimeout(reveal, OPEN_MS)
  }

  return (
    <>
      <header className="draft-bar">
        <p className="draft-flag">{eventConfig.draft.label}</p>
      </header>
      {phase === 'invitation' ? (
        <Invitation headingRef={headingRef} />
      ) : (
        <EnvelopeGate
          opening={phase === 'opening'}
          openButtonRef={openButtonRef}
          onOpen={openInvitation}
          onSkip={reveal}
        />
      )}
    </>
  )
}
