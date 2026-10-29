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
npm run build        # static export into out/
npm run start        # serve out/ locally
npm run deploy       # build + deploy to Cloudflare
npm run typecheck    # tsc --noEmit
npm run lint
```

> **Next is pinned to 16.3.8.** That pin dates from the OpenNext adapter,
> which the site no longer uses, so it can be relaxed — see
> `DECISIONS.md` section 9.

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
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID, e.g. `G-XXXXXXXXXX`. |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID, e.g. `GTM-XXXXXXX`. |

No analytics IDs are hardcoded anywhere. If neither `NEXT_PUBLIC_GA_ID` nor
`NEXT_PUBLIC_GTM_ID` is set, no tracking script is emitted at all.

There is no contact form and no mail transport — booking goes through the
scheduling dialog, so no mail credentials are required.

---

## Deploying

**Live at https://clinician.marketing**
(also `www.clinician.marketing`; `clinician--marketing.tyler-cc9.workers.dev` as a fallback)

The site is a **static export** (`output: "export"`) deployed as a
static-assets Worker — no script runs on a page request, so Cloudflare
serves every page straight from its edge cache.

```bash
npm run deploy
```

That runs `next build` (writing `out/`) and uploads it to the
`clinician--marketing` Worker named in `wrangler.jsonc`. You need wrangler authenticated — either
`npx wrangler login`, or a `CLOUDFLARE_API_TOKEN` in the environment:

```bash
CLOUDFLARE_API_TOKEN=... npm run deploy
```

`NEXT_PUBLIC_*` variables cannot be set there — Next inlines them at build
time. They live in the committed `.env.production`, so changing one needs a
redeploy.

The custom domains are declared in `wrangler.jsonc`. Note that declaring
`routes` disables the `*.workers.dev` URL by default, which is why
`"workers_dev": true` is pinned alongside them — without it, the fallback
hostname 404s.

### Deploying from CI (Workers Builds)

Settings in the Cloudflare dashboard:

- **Production branch:** `main`
- **Deploy command:** `npm run deploy` — this is `next build && wrangler
  deploy`, so it needs no separate build command.

If you would rather keep the two separate, set **Build command** to
`npm run build` and **Deploy command** to `npx wrangler deploy`. Either
works; what does not is a deploy command with no build, because
`wrangler deploy` then runs against a repo with no `out/` and fails with
*"The directory specified by the assets.directory field ... does not
exist."*

`scripts/ci-build.mjs` runs on `postinstall` as a safety net for exactly
that case: in CI, with no `out/` present, it builds. It is inert outside
CI, so a local `npm install` stays an install. Once the dashboard is set
up properly, delete the script and the `postinstall` entry — leaving both
only means the build runs twice.

### Headers

`headers()` in `next.config.ts` does **not** apply to a static export.
Caching and security headers live in `public/_headers`, which Cloudflare
Workers Static Assets reads. That file also sets `Content-Type:
image/png` on `/opengraph-image`, which Next emits without an extension —
without it, social scrapers reject the card.

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

## Brand assets

| File | Use |
| --- | --- |
| `public/brand/wordmark.webp` | Horizontal lockup, nav and footer (`Wordmark.tsx`) |
| `public/brand/wordmark-light.png` | Stacked lockup, dark on white — for light backgrounds |
| `public/brand/icon-512.png` | App icon tile |
| `src/app/icon.png`, `src/app/apple-icon.png` | Favicon and Apple touch icon |

The lockup is light-on-dark artwork with the background keyed out to
transparency, so it only reads on dark surfaces. Use the light file
anywhere the background is pale.

## Writing articles

Posts live in `src/content/posts/` — one file each, holding metadata and
the article body as Markdown in a template literal. Add a new file and
register it in `src/content/posts/index.ts`; the route, sitemap entry and
blog index pick it up automatically.

`src/lib/markdown.ts` renders the Markdown at build time, so none of it
reaches the browser. On top of standard Markdown it adds heading ids for
the contents list, turns footnote markers written as `[^3]` into
superscript links, and gives the numbered references matching ids.

### The Psychology Today guide

`/psychology-today-optimization-guide` is the exception to the above. It
was authored as hand-built HTML rather than Markdown, because its diagram,
fact grid, comparison table, example boxes and two-column checklist carry
the argument and Markdown cannot express them.

The markup lives in `src/content/psychology-today-guide.ts` and its styles
are scoped under `.pt-guide` at the bottom of `src/app/globals.css`. Those
styles use `--g-` prefixed tokens so nothing there can shadow the site's
own `--bg` / `--blue` / `--violet` for a child element, and they set type
in Inter rather than the two extra Google families the source file loaded.

The page is linked from the footer and from the top of `/blog`, and it is
registered in `src/app/sitemap.ts` by hand — it is not part of the `posts`
array.

## Booking dialog

There is no contact form. Every "Let's chat" link carries `data-booking`,
and `BookingModal.tsx` opens a centred `<dialog>` with the scheduling embed.

The links point at the scheduler URL directly with `target="_blank"`, so
they still work without JavaScript. To change the calendar, edit
`SCHEDULER_URL` at the top of `src/content/content.ts` — it feeds both the
dialog's iframe and every link's `href`.

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
