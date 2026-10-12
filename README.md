# Clinician Marketing

Marketing site for Clinician Marketing — behavioral health marketing and
business consulting. Single scrolling page with a fixed, interactive brain
point cloud behind it, plus `/privacy` and `/terms`.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and three.js.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # next build
npm run build:cf     # build the Cloudflare Worker bundle
npm run preview      # run the real Worker locally (workerd)
npm run deploy       # build + deploy to Cloudflare Workers
npm run typecheck    # tsc --noEmit
npm run lint
```

> **Do not change `build` to run the Cloudflare adapter.**
> `opennextjs-cloudflare build` calls this script internally, so pointing it
> at the adapter forks forever. Keep `build` as `next build`.

> **Next is pinned to 16.3.8.** Next 16.4 emits a manifest that
> `@opennextjs/cloudflare` does not yet understand, which makes every
> server-rendered route return 500 on Workers while static assets keep
> serving. See `DECISIONS.md` section 7.

---

## Editing the copy

**Every word on the site lives in [`src/content/content.ts`](src/content/content.ts).**
Change text there and nothing else needs touching — the components,
metadata, JSON-LD structured data and the Open Graph image all read from
that one file.

That includes the nav labels, hero headline, pricing plans and features,
FAQ questions and answers, form labels and options, the contact details and
the footer. Legal copy is the exception: `/privacy` and `/terms` are prose
pages at `src/app/privacy/page.tsx` and `src/app/terms/page.tsx`.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need. Everything is
optional — the site builds and runs without any of it.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap and JSON-LD. Defaults to `https://clinician.marketing`. |
| `RESEND_API_KEY` | Resend API key, so contact form submissions are emailed. |
| `CONTACT_TO_EMAIL` | Where enquiries are delivered. |
| `CONTACT_FROM_EMAIL` | Verified sender address on your Resend domain. |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID, e.g. `G-XXXXXXXXXX`. |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID, e.g. `GTM-XXXXXXX`. |

No analytics IDs are hardcoded anywhere. If neither `NEXT_PUBLIC_GA_ID` nor
`NEXT_PUBLIC_GTM_ID` is set, no tracking script is emitted at all.

If the mail variables are missing, the contact endpoint still accepts the
submission and logs a warning rather than showing the visitor an error.
**Set them before launch**, or enquiries go nowhere.

---

## Deploying

**Live at https://clinician.marketing**
(also `www.clinician.marketing`; `clinician--marketing.tyler-cc9.workers.dev` as a fallback)

The site runs on Cloudflare Workers via `@opennextjs/cloudflare`.

```bash
npm run deploy
```

That builds the Worker bundle and deploys it to the `clinician--marketing`
Worker named in `wrangler.jsonc`. You need wrangler authenticated — either
`npx wrangler login`, or a `CLOUDFLARE_API_TOKEN` in the environment:

```bash
CLOUDFLARE_API_TOKEN=... npm run deploy
```

Set runtime secrets (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
`CONTACT_FROM_EMAIL`) in the Cloudflare dashboard under **Worker →
Settings → Variables**.

`NEXT_PUBLIC_*` variables cannot be set there — Next inlines them at build
time. They live in the committed `.env.production`, so changing one needs a
redeploy.

The custom domains are declared in `wrangler.jsonc`. Note that declaring
`routes` disables the `*.workers.dev` URL by default, which is why
`"workers_dev": true` is pinned alongside them — without it, the fallback
hostname 404s.

### Deploying from CI (Workers Builds)

If you connect the repo to Workers Builds, set:

- **Build command:** `npx opennextjs-cloudflare build`
- **Deploy command:** `npx wrangler deploy`

The default `npm run build` is *not* enough on its own — it produces the
Next output but not the Worker entrypoint.

### Hosting it elsewhere

`npm run build && npm start` runs a standard Node server on `PORT`, and the
app deploys to Vercel as-is with no configuration. The Cloudflare config
files are inert on other hosts.

---

## The brain

The hero is a point cloud of a real brain mesh, rendered with `THREE.Points`
and a custom additive-blended shader. It sways around its lateral profile,
responds to the cursor, and stays fixed while the page scrolls over it.

### How the pipeline works

```
public/models/brain.glb          source mesh (5.7 MB, never sent to browsers)
          │
          │  npm run bake:brain
          ▼
public/models/brain-points.bin          60,000 points — desktop  (~410 KB)
public/models/brain-points-mobile.bin   12,000 points — mobile   (~82 KB)
public/brand/brain-splash.svg           static silhouette for the loading screen
```

`scripts/bake-brain-points.mjs` reads the GLB, samples points across the mesh
surface weighted by triangle area, pulls a share of them inward to give the
form volume, normalizes and shuffles them, then writes a compact binary of
quantized `int16` coordinates plus one "shell" byte per point.

Baking at build time means the browser never downloads or parses the mesh,
and never loads `GLTFLoader`. It fetches a small binary and uploads it
straight to the GPU.

### Swapping in a different brain model

1. Drop your `.glb` in as `public/models/brain.glb`.
2. Run `npm run bake:brain`.
3. Check the result:
   ```bash
   node scripts/bake-brain-points.mjs public/models/brain.glb --preview ./preview
   ```
   That writes orthographic projections down each axis to `./preview/`. The
   scene expects **+x right, +y up, +z toward the frontal pole**. If your
   mesh uses a different convention, set `ROTATE_DEG` at the top of the
   script and re-run until the projections look right.
4. Tune `OUTPUTS` (point counts) and `INTERIOR_RATIO` in the same file if
   the new mesh needs it. Too much interior fill washes out the sulci; too
   little and the cloud reads as a hollow shell.

Nothing in the React code needs changing — the loading screen silhouette is
regenerated by the same command.

### Tuning the look

Everything visual lives in `src/components/BrainField.tsx`:

- `BASE_YAW` — resting angle. `-1.48` is the lateral profile, which is the
  angle that reads as a brain instantly.
- `uSize` — point size, per device tier.
- `layout()` — scale and position per viewport aspect ratio.
- The vertex shader holds the cursor-repulsion field and the depth-based
  blue → violet → white gradient.

### Performance behaviour

The canvas is deliberately kept off the critical path:

- three.js is a **separate chunk**, not requested until the browser goes
  idle or the visitor interacts (`src/components/BrainBackdrop.tsx`).
- Until it arrives — and if WebGL is unavailable — a CSS gradient backdrop
  stands in, server-rendered so it paints in the first frame.
- Device tier picks the 60k or 12k cloud and caps the pixel ratio.
- **Software renderers** (SwiftShader, llvmpipe, Microsoft Basic Render) are
  detected and get a single static frame instead of an animation loop.
- Rendering pauses when the tab is hidden; frame rate is capped on low-power
  devices and when `prefers-reduced-motion` is set.

---

## Loading screen

`src/components/LoadingScreen.tsx` shows the brain silhouette, the wordmark
and a progress bar for ~3.5s on a full page load.

It is pure CSS and server-rendered — no JavaScript, no hydration. The
animation ends on its own, so the overlay always clears even if scripts fail
or are blocked. It is `pointer-events: none` throughout, so it can never trap
a click or scroll, and `aria-hidden`, so screen readers go straight to the
content.

To change the duration, edit the `.splash` animation in
`src/app/globals.css` (`3.5s`) and the `.splash-bar::after` progress
animation (`3.2s`) to match. To remove it, delete `<LoadingScreen />` from
`src/app/layout.tsx`.

See `DECISIONS.md` for its effect on measured performance.

---

## The logo

`public/brand/m-logo.svg` is the "M" used in the wordmark, rendered by
`src/components/Wordmark.tsx` between "Clinician " and "arketing".

**The file currently there is a hand-traced reconstruction, not the original
vector.** Replace it with the real asset, keeping the same path and
filename, and nothing else needs to change. Its `viewBox` should be cropped
tight to the glyph so the baseline alignment in the wordmark keeps working.

---

## Project layout

```
src/
  app/
    layout.tsx              root layout, metadata, JSON-LD, fonts
    page.tsx                the single page — composes the sections
    globals.css             design tokens, scrim utilities, splash
    opengraph-image.tsx     OG card, rendered from the real point cloud
    sitemap.ts / robots.ts
    privacy/ terms/         legal pages
    api/contact/route.ts    form endpoint
  components/
    BrainBackdrop.tsx       fixed layer; defers the canvas
    BrainField.tsx          three.js point cloud
    LoadingScreen.tsx       CSS splash
    Section.tsx             shared section shell with the scrim
    SiteNav.tsx Footer.tsx Wordmark.tsx Hero.tsx
    sections/               one component per page section
  content/content.ts        ALL COPY
  lib/
    brain-geometry.ts       procedural fallback cloud
    structured-data.ts      Organization, Service, FAQ JSON-LD
    site.ts
scripts/bake-brain-points.mjs
```

---

## Accessibility

Verified with axe-core (WCAG 2.1 A and AA) on the home page at desktop and
mobile widths, and on `/privacy` and `/terms` — **zero violations**.
Lighthouse accessibility scores 100.

- Keyboard navigable throughout, with a skip link and visible focus rings.
- All body copy meets AA contrast against the section scrims, which are
  opaque enough on their own without relying on `backdrop-filter`.
- `prefers-reduced-motion` reduces the canvas to a slow drift with no cursor
  physics, and collapses the loading screen.
- The FAQ uses native `<details>`, so it works without JavaScript.
