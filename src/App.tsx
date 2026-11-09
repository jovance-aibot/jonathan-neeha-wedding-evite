import { useEffect, useRef, useState } from 'react'
import { coupleLabel } from './config/event.ts'
import { EnvelopeGate } from './components/Envelope.tsx'
import { Invitation } from './components/Invitation.tsx'
import { usePrefersReducedMotion } from './lib/motion.ts'

type Phase = 'closed' | 'opening' | 'handoff' | 'arrive' | 'invitation'

/** Letter rise ends at 3200ms. The gate fades out before the hero fades in. */
export const HANDOFF_AT = 3300
export const GATE_FADE_MS = 600
export const HERO_DELAY_MS = 540
export const HERO_FADE_MS = 760
export const HANDOFF_MS = HERO_DELAY_MS + HERO_FADE_MS
export const OPEN_MS = HANDOFF_AT + HANDOFF_MS
const MUSIC_VOLUME = 0.35

export default function App() {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>('closed')
  const [musicOn, setMusicOn] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const revealTimer = useRef<number | null>(null)
  const revealed = useRef(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const musicChoice = useRef<'unset' | 'on' | 'off'>('unset')

  useEffect(() => {
    document.title = coupleLabel()
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduce' : 'full'
  }, [reduced])

  useEffect(() => {
    if (phase === 'invitation') headingRef.current?.focus()
  }, [phase])

  useEffect(() => {
    if (phase !== 'opening') return
    const images = document.querySelectorAll('.hero-reveal img')
    images.forEach((node) => {
      if (!(node instanceof HTMLImageElement) || typeof node.decode !== 'function') return
      void node.decode().catch(() => undefined)
    })
  }, [phase])

  useEffect(() => {
    return () => {
      if (revealTimer.current !== null) window.clearTimeout(revealTimer.current)
    }
  }, [])

  function playMusic() {
    const audio = audioRef.current
    if (!audio) return
    musicChoice.current = 'on'
    audio.volume = MUSIC_VOLUME
    let pending: Promise<void> | undefined
    try {
      pending = audio.play()
    } catch {
      setMusicOn(false)
      return
    }
    void pending?.catch(() => setMusicOn(false))
  }

  function stopMusic() {
    musicChoice.current = 'off'
    audioRef.current?.pause()
  }

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
    if (revealed.current || phase === 'opening' || phase === 'handoff' || phase === 'arrive') return
    if (musicChoice.current !== 'off') playMusic()
    if (reduced) {
      reveal()
      return
    }
    setPhase('opening')
    revealTimer.current = window.setTimeout(() => {
      window.scrollTo(0, 0)
      setPhase('handoff')
      revealTimer.current = window.setTimeout(() => {
        setPhase('arrive')
        revealTimer.current = window.setTimeout(reveal, HERO_FADE_MS)
      }, HERO_DELAY_MS)
    }, HANDOFF_AT)
  }

  const invitationReady = phase !== 'closed'
  const invitationSettled = phase === 'invitation'
  const gateOpen = phase === 'opening' || phase === 'handoff' || phase === 'arrive'

  return (
    <>
      {gateOpen ? <div className="reveal-ground" aria-hidden="true" /> : null}
      {invitationReady ? (
        <div
          className={invitationSettled ? undefined : phase === 'arrive' ? 'hero-reveal is-arriving' : 'hero-reveal'}
          inert={invitationSettled ? undefined : true}
          aria-hidden={invitationSettled ? undefined : true}
        >
          <Invitation headingRef={invitationSettled ? headingRef : undefined} />
        </div>
      ) : null}
      {invitationSettled ? null : (
        <EnvelopeGate opening={gateOpen} fading={phase === 'handoff' || phase === 'arrive'} onOpen={openInvitation} />
      )}
      <button
        type="button"
        className="music-toggle"
        aria-pressed={musicOn}
        aria-label={musicOn ? 'Turn music off' : 'Play music'}
        onClick={() => (musicOn ? stopMusic() : playMusic())}
      >
        <MusicMark on={musicOn} />
      </button>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/painted-woods-in-autumn.mp3`}
        loop
        preload="none"
        onPlay={() => setMusicOn(true)}
        onPause={() => setMusicOn(false)}
        onError={() => setMusicOn(false)}
      />
    </>
  )
}

function MusicMark({ on }: { on: boolean }) {
  return (
    <svg className="music-mark" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9 17.5a2.5 2.5 0 1 1-2-2.45V6.2l10-2v9.35a2.5 2.5 0 1 1-2-2.45V7.1l-6 1.2v9.2z"
      />
      {on ? null : <path d="M4.2 4.2l15.6 15.6" fill="none" stroke="currentColor" strokeWidth="1.8" />}
    </svg>
  )
}
