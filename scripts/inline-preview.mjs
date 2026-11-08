import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const distDir = resolve('dist')
let html = readFileSync(join(distDir, 'index.html'), 'utf8')

function distFile(url) {
  const clean = url.split('?')[0].split('#')[0].replace(/^\.\//, '').replace(/^\//, '')
  const parts = clean.split('/').filter(Boolean)
  for (let index = 0; index < parts.length; index += 1) {
    const candidate = join(distDir, parts.slice(index).join('/'))
    if (existsSync(candidate)) return candidate
  }
  throw new Error(`Built file not found for ${url}`)
}

html = html.replace(/<link\b([^>]*)>/g, (tag, attrs) => {
  if (/rel="modulepreload"/.test(attrs)) return ''
  if (!/rel="stylesheet"/.test(attrs)) return tag
  const href = attrs.match(/href="([^"]+)"/)
  if (!href) return tag
  const css = readFileSync(distFile(href[1]), 'utf8')
  return `<style>\n${css}\n</style>`
})

html = html.replace(/<script\b([^>]*)><\/script>/g, (tag, attrs) => {
  const src = attrs.match(/\ssrc="([^"]+)"/)
  if (!src) return tag
  const js = readFileSync(distFile(src[1]), 'utf8').replace(/<\/script/gi, '<\\/script')
  return `<script type="module">\n${js}\n</script>`
})

html = html.replace(/href="([^"]*favicon\.svg)"/g, (_full, href) => {
  const svg = readFileSync(distFile(href), 'utf8')
  return `href="data:image/svg+xml,${encodeURIComponent(svg)}"`
})

const remoteTag = html.match(
  /<(?:script|link|img|iframe|source|audio|video)\b[^>]*(?:src|href)=["']https?:/i,
)
if (remoteTag) {
  console.error('Offline preview still points at a remote resource')
  process.exit(1)
}

const out = resolve(process.argv[2] ?? '/opt/cursor/artifacts/invitation-preview.html')
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, html)
console.log(out)
