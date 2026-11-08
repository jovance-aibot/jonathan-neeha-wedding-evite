import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { setReducedMotion } from './matchMedia.ts'

beforeEach(() => {
  if (typeof window !== 'undefined') setReducedMotion(false)
})

afterEach(() => {
  if (typeof document !== 'undefined') {
    cleanup()
    document.documentElement.removeAttribute('data-motion')
  }
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
