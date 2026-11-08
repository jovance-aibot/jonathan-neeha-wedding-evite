# Jonathan and Neeha — invitation draft

The wedding invitation for Jonathan Ve Vance and Neeha Shaitus. The page is hosted with GitHub Pages from this repository. It does not collect replies or call a guest service. Fonts and photographs are files in this repository. Google Maps is requested only after Show map is clicked.

The live page is [https://jovance-aibot.github.io/jonathan-neeha-wedding-evite/](https://jovance-aibot.github.io/jonathan-neeha-wedding-evite/).

The photographs are temporary stock images. They are not Jonathan and Neeha, and the evening scene is not Philip Pavilion. See `docs/photo-provenance.md`.

## Local run

```bash
npm install
npm test
npm run lint
npm run build
npm run dev
```

`npm run dev` binds to `127.0.0.1:47321` only. `npm run preview` serves the production build on port 47321. Because this is a project site, the built app is under `/jonathan-neeha-wedding-evite/`.

`npm run preview:file` writes one offline HTML file to `/opt/cursor/artifacts/invitation-preview.html`. That file is a local copy, not the published site.

## Pages

Pushes to `main` run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow installs dependencies, runs tests and lint, builds `dist`, and deploys that folder with GitHub’s Pages actions. The repository setting **Settings → Pages → Source** must be **GitHub Actions**. There is no custom domain.

Vite `base` is `/jonathan-neeha-wedding-evite/` so the script and stylesheet resolve on that subpath.

## Content

Confirmed facts and wording live in [`src/config/event.ts`](src/config/event.ts).

The ceremony start and the countdown target are the same instant: `2026-12-28T15:30:00+05:30` in `Asia/Kolkata`. After that instant the page says the ceremony time has passed. Less than a second before it, the page says less than a second remains. The page does not offer a calendar file.

Opening the envelope starts “Painted Woods in Autumn” by TheFealdoProject. **Play music** and **Turn music off** stay in the floating control. The recording is part of this invitation only; the page does not offer it as its own download. Source, hash, and licence notes are in [MUSIC.md](MUSIC.md).

## Confirmed

- Jonathan Ve Vance and Neeha Shaitus
- Monday, 28 December 2026
- Ceremony, 3:30–4:30 PM IST, Philip Pavilion, Memury, in the AC hall
- Reception outdoors at Philip Pavilion from 6:30 PM IST, with no confirmed end time
- Directions open the supplied Google Maps link for that venue

## Still open on purpose

- The photographs are stock, not the couple or the venue
- There is no reply path

No street address, contact details, dress code, parents, story, or extra events are invented here. **Get directions** uses the supplied Maps link and does not open it on its own. **Show map** is the only control that loads the map. The music control plays the supplied recording after Open invitation.

## Limits

- The site is public at the Pages address above.
- There is no RSVP form and no guest storage. Nothing is sent to an invite service.
- React’s production bundle includes the text `https://react.dev/errors/` for its error decoder, plus W3C namespace strings used by SVG. The invitation does not request those addresses.

## Technology actually installed

- Node.js 22.23.4
- React 19.3.1 and React DOM 19.3.1
- Vite 8.3.6 with `@vitejs/plugin-react` 6.2.1
- TypeScript 7.0.2
- Vitest 5.1.0, jsdom 31.0.0
- Testing Library React 16.3.3, user-event 14.6.8, jest-dom 7.0.1
- oxlint 1.92.0
- Puppeteer core 25.16.0, used only to capture local screenshots of the offline file

The opened page uses self-hosted Noto Serif and Source Sans 3, subset under the SIL Open Font License. Those license texts are in `licenses/fonts/`. The envelope artwork stays in the original system serif. Dependency licenses stay recorded in `package-lock.json`.
