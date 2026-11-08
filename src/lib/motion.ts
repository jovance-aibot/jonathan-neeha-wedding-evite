import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(QUERY).matches
    : false
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}
