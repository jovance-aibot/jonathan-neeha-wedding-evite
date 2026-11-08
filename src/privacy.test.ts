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

const allowedUrls = [
  'https://maps.app.goo.gl/6DUQjm4gRWES4AgY6?g_st=ic',
  'https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sWGW2%2B4C+Philips+pavilion,+Memury,+Keralam+686663',
]

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
  ['geolocation', /navigator\.geolocation|allow=["'][^"']*geolocation/i],
  ['window open', /window\.open\s*\(/],
]

function scrub(text: string): string {
  let next = text.split(svgNamespace).join('')
  for (const url of allowedUrls) next = next.split(url).join('')
  return next
}

describe('privacy boundaries', () => {
  it('keeps the draft free of remote calls, media, and guest endpoints', () => {
    const files = roots.flatMap((root) => filesIn(root))
    expect(files.length).toBeGreaterThan(5)
    const hits: string[] = []
    for (const file of files) {
      const raw = readFileSync(file, 'utf8')
      const text = scrub(raw)
      for (const [label, pattern] of banned) {
        if (pattern.test(text)) hits.push(`${file}: ${label}`)
      }
      const iframes = raw.match(/<iframe\b[^>]*>/gi) ?? []
      if (iframes.length > 0 && !file.endsWith('src/components/Invitation.tsx')) {
        hits.push(`${file}: iframe`)
      }
      if (iframes.length > 1) hits.push(`${file}: extra iframe`)
      if (iframes.some((tag) => /src\s*=\s*["']https?:/i.test(tag) || /geolocation/i.test(tag))) {
        hits.push(`${file}: unsafe iframe`)
      }
    }
    expect(hits).toEqual([])
  })
})
