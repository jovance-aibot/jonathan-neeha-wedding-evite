import puppeteer from 'puppeteer-core'

const target = process.argv[2]
if (!target) {
  console.error('Pass the page address to check')
  process.exit(1)
}

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? '/usr/local/bin/google-chrome',
  headless: true,
  protocolTimeout: 20000,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

async function facts(page) {
  return page.evaluate(() => {
    const box = (el) => {
      const rect = el.getBoundingClientRect()
      return { x: rect.x, w: rect.width, right: rect.right, cx: rect.x + rect.width / 2 }
    }
    const envelope = document.querySelector('.envelope')
    const card = document.querySelector('.gate-card')
    const h1 = document.querySelector('h1')
    const sheet = document.querySelector('.sheet')
    const sprig = document.querySelector('.closing-sprig')
    const opened = document.body.innerText.includes('AC hall')
    const frames = [...document.querySelectorAll('.frame')].map((frame) => {
      const label = frame.querySelector('span')
      return label.getBoundingClientRect().width <= frame.getBoundingClientRect().width - 4
    })
    const cardBox = card ? box(card) : null
    const buttons = [...document.querySelectorAll('.gate .button')].map(box)
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      envelopeDelta: envelope && cardBox ? Math.abs(box(envelope).w - cardBox.w) : null,
      buttonsInside: cardBox ? buttons.every((button) => button.x >= cardBox.x - 1 && button.right <= cardBox.right + 1) : null,
      h1Outline: h1 ? getComputedStyle(h1).outlineStyle : null,
      sprigCentered: sheet && sprig ? Math.abs(box(sprig).cx - box(sheet).cx) : null,
      framesFit: opened ? frames.every(Boolean) : null,
      rsvp: document.body.innerText.includes('Replies are not collected here'),
      mapDisabled: document.querySelector('button[disabled]')?.textContent ?? '',
    }
  })
}

const results = []
for (const viewport of [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 390, height: 844 },
]) {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  await page.goto(target, { waitUntil: 'load' })
  const closed = await facts(page)
  await page.click('#skip-envelope')
  await page.waitForFunction(() => document.body.innerText.includes('AC hall'))
  const opened = await facts(page)
  await page.addStyleTag({ content: ':root { --serif: "DejaVu Serif", serif; --sans: "DejaVu Sans", sans-serif; }' })
  const wide = await facts(page)
  results.push({ viewport: viewport.name, closed, opened, wide })
  await page.close()
}

await browser.close()
console.log(JSON.stringify(results, null, 2))

const bad = []
for (const row of results) {
  if (row.closed.overflow > 1) bad.push(`${row.viewport} overflow`)
  if (row.closed.envelopeDelta > 2) bad.push(`${row.viewport} envelope delta ${row.closed.envelopeDelta}`)
  if (row.closed.buttonsInside !== true) bad.push(`${row.viewport} buttons`)
  if (row.opened.h1Outline !== 'none') bad.push(`${row.viewport} heading outline ${row.opened.h1Outline}`)
  if (row.opened.sprigCentered > 6) bad.push(`${row.viewport} sprig ${row.opened.sprigCentered}`)
  if (row.wide.framesFit !== true) bad.push(`${row.viewport} wide font frames`)
  if (row.wide.overflow > 1) bad.push(`${row.viewport} wide font overflow`)
  if (!row.opened.rsvp) bad.push(`${row.viewport} rsvp`)
  if (row.opened.mapDisabled.trim() !== 'Map unavailable') bad.push(`${row.viewport} map`)
}
if (bad.length) {
  console.error(bad.join('\n'))
  process.exit(1)
}
