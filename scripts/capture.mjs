import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'

const htmlPath = resolve(process.argv[2] ?? '/opt/cursor/artifacts/invitation-preview.html')
const outDir = resolve(process.argv[3] ?? '/opt/cursor/artifacts')
const fileUrl = pathToFileURL(htmlPath).href
const remote = []
const pageErrors = []

function isRemote(url) {
  return /^https?:\/\//i.test(url)
}

function watch(page) {
  page.on('request', (request) => {
    if (isRemote(request.url())) remote.push(request.url())
  })
  page.on('pageerror', (error) => {
    pageErrors.push(String(error))
  })
}

async function prepare(page, viewport) {
  await page.setViewport(viewport)
  watch(page)
  await page.goto(fileUrl, { waitUntil: 'load' })
  await Promise.race([
    page.evaluate(() => document.fonts.ready),
    new Promise((resolve) => setTimeout(resolve, 2000)),
  ])
}

function overflowScript() {
  return {
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }
}

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? '/usr/local/bin/google-chrome',
  headless: true,
  protocolTimeout: 30000,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
})

const desktop = { width: 1280, height: 800, deviceScaleFactor: 1 }
const mobile = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }

const desktopPage = await browser.newPage()
await prepare(desktopPage, desktop)
await desktopPage.screenshot({ path: join(outDir, 'screenshot_desktop_envelope_v2.png') })
await desktopPage.evaluate(() => {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
})
await desktopPage.keyboard.press('Tab')
await desktopPage.screenshot({ path: join(outDir, 'screenshot_desktop_focus_v2.png') })
await desktopPage.keyboard.press('Enter')
await desktopPage.waitForFunction(() => document.body.innerText.includes('AC hall'))
await desktopPage.evaluate(() => {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
})
await desktopPage.screenshot({ path: join(outDir, 'screenshot_desktop_invitation_v2.png') })
await desktopPage.screenshot({ path: join(outDir, 'screenshot_desktop_full_v2.png'), fullPage: true })
const desktopOverflow = await desktopPage.evaluate(overflowScript)

const mobilePage = await browser.newPage()
await prepare(mobilePage, mobile)
await mobilePage.screenshot({ path: join(outDir, 'screenshot_mobile_envelope_v2.png') })
await mobilePage.click('#open-invitation')
await mobilePage.waitForFunction(() => document.body.innerText.includes('AC hall'))
await mobilePage.evaluate(() => {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
})
await mobilePage.screenshot({ path: join(outDir, 'screenshot_mobile_invitation_v2.png') })
await mobilePage.screenshot({ path: join(outDir, 'screenshot_mobile_full_v2.png'), fullPage: true })
const mobileOverflow = await mobilePage.evaluate(overflowScript)

const tabletPage = await browser.newPage()
await prepare(tabletPage, { width: 768, height: 1024, deviceScaleFactor: 1 })
await tabletPage.screenshot({ path: join(outDir, 'screenshot_tablet_envelope_v2.png') })

async function layoutFacts(page) {
  return page.evaluate(() => {
    const rect = (el) => {
      const box = el.getBoundingClientRect()
      return { x: box.x, w: box.width, right: box.right }
    }
    const envelope = document.querySelector('.envelope')
    const card = document.querySelector('.gate-card')
    const opened = document.body.innerText.includes('AC hall')
    const h1 = document.querySelector('h1')
    const sheet = document.querySelector('.sheet')
    const sprig = document.querySelector('.closing-sprig')
    const frames = [...document.querySelectorAll('.frame')].map((frame) => {
      const label = frame.querySelector('span')
      return label.getBoundingClientRect().width <= frame.getBoundingClientRect().width - 4
    })
    const buttons = [...document.querySelectorAll('.gate .button')].map(rect)
    const cardBox = card ? rect(card) : null
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      envelopeDelta: envelope && card ? Math.abs(rect(envelope).w - cardBox.w) : null,
      buttonsInside: cardBox ? buttons.every((button) => button.x >= cardBox.x - 1 && button.right <= cardBox.right + 1) : null,
      h1Outline: h1 ? getComputedStyle(h1).outlineStyle : null,
      sprigCentered: sheet && sprig
        ? Math.abs((sprig.getBoundingClientRect().x + sprig.getBoundingClientRect().width / 2) - (sheet.getBoundingClientRect().x + sheet.getBoundingClientRect().width / 2))
        : null,
      framesFit: opened ? frames.every(Boolean) : null,
    }
  })
}

const desktopClosed = await (async () => {
  const page = await browser.newPage()
  await prepare(page, desktop)
  const facts = await layoutFacts(page)
  await page.close()
  return facts
})()
const wideFont = await (async () => {
  const page = await browser.newPage()
  await prepare(page, { width: 390, height: 844, deviceScaleFactor: 1 })
  await page.addStyleTag({ content: ':root { --serif: "DejaVu Serif", serif; --sans: "DejaVu Sans", sans-serif; }' })
  await page.click('#skip-envelope')
  await page.waitForFunction(() => document.body.innerText.includes('AC hall'))
  const facts = await layoutFacts(page)
  await page.close()
  return facts
})()

await browser.close()

console.log(JSON.stringify({
  desktopOverflow,
  mobileOverflow,
  desktopClosed,
  wideFont,
  remote,
  pageErrors,
}, null, 2))

if (remote.length || pageErrors.length) process.exit(1)
if (desktopOverflow.scrollWidth > desktopOverflow.clientWidth + 1) process.exit(1)
if (mobileOverflow.scrollWidth > mobileOverflow.clientWidth + 1) process.exit(1)
if (desktopClosed.envelopeDelta > 2 || desktopClosed.buttonsInside !== true || desktopClosed.overflow > 1) process.exit(1)
if (wideFont.overflow > 1 || wideFont.framesFit !== true || wideFont.h1Outline !== 'none' || wideFont.sprigCentered > 4) process.exit(1)
