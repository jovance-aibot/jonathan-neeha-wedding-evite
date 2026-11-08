// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const roots = ['src', 'public', 'scripts', 'index.html']
const svgNamespace = 'http://www.w3.org/2000/svg'

function filesIn(path: string): string[] {
  const stat = statSync(path, { throwIfNoEntry: false })
  if (!stat) return []
  if (stat.isFile()) {
    if (path.endsWith('.test.ts') || path.endsWith('.test.tsx')) return []
    return [path]
  }
  return readdirSync(path).flatMap((entry) => filesIn(join(path, entry)))
}

const banned: Array<[string, RegExp]> = [
  ['fetch', /fetch\s*\(/],
  ['xhr', /XMLHttpRequest/],
  ['beacon', /sendBeacon/],
  ['audio', /<audio\b|new Audio\b/],
  ['remote url', /https?:\/\//i],
  ['font host', /googleapis|gstatic/i],
  ['analytics', /google-analytics|googletagmanager|gtag\s*\(/i],
  ['map host', /maps\.google|openstreetmap|mapbox/i],
  ['the knot', /theknot/i],
  ['mailto', /mailto:/i],
  ['telephone', /tel:/i],
  ['websocket', /WebSocket/],
  ['iframe', /<iframe\b/i],
]

describe('privacy boundaries', () => {
  it('keeps the draft free of remote calls, media, and guest endpoints', () => {
    const files = roots.flatMap((root) => filesIn(root))
    expect(files.length).toBeGreaterThan(5)
    const hits: string[] = []
    for (const file of files) {
      const text = readFileSync(file, 'utf8').split(svgNamespace).join('')
      for (const [label, pattern] of banned) {
        if (pattern.test(text)) hits.push(`${file}: ${label}`)
      }
    }
    expect(hits).toEqual([])
  })
})
