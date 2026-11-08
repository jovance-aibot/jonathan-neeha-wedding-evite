import { useEffect, useRef, useState } from 'react'
import { coupleLabel, eventConfig } from './config/event.ts'
import { EnvelopeGate } from './components/Envelope.tsx'
import { Invitation } from './components/Invitation.tsx'
import { usePrefersReducedMotion } from './lib/motion.ts'

type Phase = 'closed' | 'opening' | 'invitation'

export const OPEN_MS = 2100
const MUSIC_VOLUME = 0.35

export default function App() {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>('closed')
  const [musicOn, setMusicOn] = useState(false)
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const revealTimer = useRef<number | null>(null)
  const revealed = useRef(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const musicChoice = useRef<'unset' | 'on' | 'off'>('unset')

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
    if (revealed.current || phase === 'opening') return
    if (musicChoice.current !== 'off') playMusic()
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
          onRecedeEnd={reveal}
        />
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
