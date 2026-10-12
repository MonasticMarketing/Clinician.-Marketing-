# Decisions and open items

Every judgment call made during the build, and everything still waiting on
you. Read the first section before launch — nothing there should ship as-is.

---

## 1. NEEDS YOUR REVIEW BEFORE LAUNCH

### 1.1 Logo — RESOLVED

The supplied artwork is in. `public/brand/wordmark.webp` is the horizontal
lockup used in the nav and footer; the app-icon tile supplies the favicon
and the Apple touch icon; `public/brand/wordmark-light.png` is the stacked
dark-on-white lockup, kept for light backgrounds (it is not used on the
site, which is dark throughout).

The lockup arrived on a solid `#070B1E` background. That would have shown
as a rectangle over the point cloud in the nav, so the background was keyed
out to transparency, estimating per-pixel alpha from each channel's
excursion away from the background colour, which preserves the antialiased
edges. The earlier hand-traced SVG has been deleted.

<details><summary>Original note</summary>

**`public/brand/m-logo.svg` is not your original vector.** The file you sent
arrived as a rendered image rather than as a file this environment could
read, so I traced the mark by eye from it. It is visually very close and
reads correctly at nav size, but it will not be geometrically exact.

Superseded by the supplied artwork.
</details>

### 1.2 Booking widget branding — RESOLVED

You first confirmed Monastic branding was acceptable since it is the parent
company, then supplied a replacement calendar. The current widget
(`.../widget/booking/dYHqgRAxyhgJUOb2XPle`) renders as **"Clinician
Marketing Appointment"** with the Clinician Marketing mark, so the
brief's rule — Monastic only in the footer small print — now holds
everywhere on the site. Original note kept below for context.

Your brief says Monastic Marketing appears only in the footer small print —
no Monastic logo anywhere. The booking widget you supplied
(`link.bemonastic.com/widget/booking/dYHqgRAxyhgJUOb2XPle`) currently
renders **the Monastic Marketing logo and the title "Monastic 30-minute
Call"** inside the contact section.

This is a GoHighLevel setting, not something the site can override.

**Action, in your GHL account:**
- Rename the calendar (e.g. "Clinician Marketing — 30-minute Call").
- Replace the logo on the booking widget with the Clinician Marketing mark.
- Optionally white-label the domain so the URL is not `bemonastic.com`.

The embed URL lives at `content.scheduler.embedUrl` in
`src/content/content.ts` if it changes.

### 1.3 Guarantee terms are placeholder legal text — DEFERRED BY YOU

`/terms` section 2 drafts both guarantees in plain language — what is
measured, over what period, what the remedy is, what you must do, what is
excluded. **Every number is a bracketed placeholder:**

- 4.25x ROAS: measurement window length, ramp-up length, how long the
  fee-waived remedy runs.
- Page-one ranking: guarantee period, and how many (or what percentage) of
  the agreed keywords must rank for the guarantee to be met.
- Contract: initial term and notice period (also referenced in the FAQ).
- Liability cap and indemnity wording are marked for counsel.

The page carries a visible "Draft for review" banner. **Remove it only once
the content is final.** None of this has been reviewed by a lawyer.

### 1.4 Privacy notice is placeholder — DEFERRED BY YOU

`/privacy` has bracketed gaps for your vendor list, retention period, and
which state privacy laws apply. Same visible draft banner.

### 1.5 Plan 3 pricing — RESOLVED

Enterprise / Multi-location is set to **$7,000 per month**, as you
specified, with a "Let's chat" CTA.

### 1.6 The founders' story is written blind — YOU WILL REVISE LATER

`content.about.paragraphs` uses "our founders" throughout and names nobody,
as instructed. The specifics — hiring and losing clinicians, carrying
payroll through a slow quarter, an intake line going unanswered — are
**plausible invented detail, not facts I was given.** Read it and replace
anything that is not true of you.

### 1.7 Contact details

- **Phone** — `(972) 366-4899`, as supplied. Live in the footer and the
  contact section.
- **Email** — `Team@bemonastic.com`, as you specified. You said you will
  change it later; it is one line in `content.brand.email`.
- **Domain** — confirmed as `clinician.marketing`. This is the default in
  `src/lib/site.ts`. **Set `NEXT_PUBLIC_SITE_URL` on the Worker** so
  metadata, sitemap and JSON-LD emit the right origin (see section 7).

### 1.8 Hero headline — RESOLVED

Now reads: **"We've owned, run and scaled practices and treatment centers,
and now we help yours grow."** This also resolves the earlier "have ran"
grammar concern.

The headline type scale was reduced (3.3rem on desktop, down from 4.25rem)
because a full sentence at the old size ran to six lines. It now sets in
four.

---

## 2. Framework and stack

**Next.js 16 (App Router) + TypeScript + Tailwind v4**, over Vite.

The site needs a serverless endpoint for the contact form, two extra routes,
per-route metadata, `sitemap.xml`, `robots.txt` and a generated Open Graph
image. Next gives all of that from the framework; Vite would have meant
bolting on a separate function host and hand-rolling the SEO plumbing. The
single-page nature of the site does not outweigh that.

**Pinned to Next 16.4.0.** The initial scaffold used 15.5.4, which npm
flagged for CVE-2025-66478. Upgraded before writing any application code.

---

## 3. The brain

### 3.1 Mesh source

Generated with the **Higgsfield MCP connector**, which was available, so
option 1 in your brief. Two-step: `gpt_image_2_5` produced a clean
three-quarter reference render of an anatomically accurate brain, then
Meshy `image_to_3d` converted it to a 150k-triangle untextured GLB with
symmetry enforced. Cost 20 credits.

The result reads unmistakably as a brain — both hemispheres, longitudinal
fissure, legible sulci and gyri, no stem, no cerebellum.

`public/models/brain.glb` is the full 5.7 MB source. **It is never
downloaded by a browser** — nothing references it, and the point clouds are
baked from it at build time. It is kept in the repo so the cloud can be
re-baked or the model swapped. I did not decimate it: that would lose sulci
detail in future re-bakes for no runtime benefit, since the file is not
served. Your brief's "under 2 MB" applied to the CC0 fallback path, which
was not used.

### 3.2 Baking instead of loading the mesh

The page only ever needs point positions — never triangles, materials or
UVs. So `scripts/bake-brain-points.mjs` samples the mesh at build time into
a quantized binary. The browser skips `GLTFLoader` (~30 KB), skips mesh
parsing on the main thread, and downloads 410 KB instead of 5.7 MB.

**Format (`BPC2`):** magic, `uint32` count, `int16 × 3` per point, then one
`uint8` "shell" byte per point.

That shell byte earned its place. A purely surface-sampled cloud with
additive blending piles light up along the silhouette and leaves the middle
dark, so it reads as a hollow ball rather than a brain. Interior points fix
that, but at full brightness they smear the sulci. Shipping the distinction
lets the shader draw interior points smaller and dimmer — mass without mush.
Current split is 34% interior.

Two files are baked: 60k points for desktop, 12k for mobile. Points are
shuffled, so any prefix is a well-distributed subset.

### 3.3 Sway, not spin

Your brief asked for gentle self-rotation. A continuous 360° spin spends
half its time on the front and back views, where a brain reads as an
anonymous blob. Instead it **sways ±17° around the lateral profile**
(`BASE_YAW = -1.48`), which is the angle that reads as a brain instantly.
Cursor parallax and touch drag stack on top. Change `BASE_YAW` and the sway
amplitude in `BrainField.tsx` if you want the full rotation.

### 3.4 Vanilla three.js, not react-three-fiber

Your brief made R3F conditional ("if using React"). The scene is one
`Points` object with one material that never re-renders from React state, so
a reconciler would add bundle weight and a second render loop for no
benefit. All per-point motion is in the vertex shader; the CPU updates a
handful of uniforms per frame.

### 3.5 Touch behaviour

Horizontal drag turns the brain; vertical movement is left entirely to the
browser, and `touchmove` is passive with no `preventDefault`. Hijacking
vertical drag would have broken scrolling on the one device class where
scrolling matters most.

### 3.6 Device tiering

Viewport width and pointer type decide the tier. **Core count is
deliberately a weak signal** — an early version treated
`hardwareConcurrency <= 4` as low-power, which wrongly demoted ordinary
laptops to the 12k cloud and made the hero look sparse and fuzzy. Now only
`<= 2` counts.

Software renderers (SwiftShader, llvmpipe, Microsoft Basic Render) are
detected via `WEBGL_debug_renderer_info` and get **one static frame** rather
than an animation loop — they rasterize every blended fragment on the CPU,
which would otherwise eat the main thread the visitor needs for scrolling.

---

## 4. Layout and contrast

The fixed canvas sits at `z-index: 0`; all content scrolls above it.

Each section's background is a vertical scrim: firm (93–94% opaque) through
the middle where the copy sits, softening at both edges. Stacked sections
therefore leave a **lighter band between them where the point cloud shows
through clearly**, which is what keeps the page reading as text moving over
a living brain rather than over a flat panel.

**Contrast never depends on `backdrop-filter`.** The firm band is opaque
enough for AA on its own; the blur is an enhancement where supported. A
scrim that relied on blur would fail AA in any browser that disables it.

On mobile the hero scrim has to be firm from the headline down, so the brain
rides high and reads as a luminous band above the headline instead of a
smear behind it.

---

## 5. Measured results

Run against the production build in this container.

### Accessibility — passing

- **axe-core (WCAG 2.1 A + AA): 0 violations** on `/` at 1440px and 390px,
  and on `/privacy` and `/terms`.
- **Lighthouse accessibility: 100.** Best practices: 100. SEO: 100.
- Keyboard order verified: skip link → wordmark → nav items → CTA.

Four contrast failures were found and fixed during the pass — decorative
small monospace text at 70–80% opacity measured 4.02:1 against the
background.

### Performance — below your target, and here is exactly why

| | Mobile | Desktop |
| --- | --- | --- |
| Performance | **82** | 62 |
| FCP | 0.9 s | 1.0 s |
| LCP | 2.9 s | 2.7 s |
| TBT | 490 ms | 500 ms |
| CLS | 0 | 0 |

(Final figures, measured with the loading screen in place. Before it was
added the mobile score was 83 with LCP 2.5 s.)

Your target was ≥ 85 on mobile. **The page itself is fast — the gap is
three.js.** Measured directly: with the canvas chunk blocked and everything
else identical, mobile scores **96** with a TBT of 100 ms.

This container has **no GPU**, so Chrome falls back to SwiftShader and
rasterizes the additive point cloud on the CPU. Splitting the remaining
cost: roughly 290 ms is three.js parse and evaluation (real, and it will
show up on real mobile devices too) and roughly 500–600 ms is software
rasterization (an artifact of this machine that largely disappears on any
device with a real GPU). Desktop and mobile show near-identical absolute
timings, which confirms the container's CPU is the bottleneck rather than
the page.

Work already done to reduce it:
- three.js is a separate chunk, not requested until browser idle or first
  interaction, so it is off the critical path entirely.
- A server-rendered CSS gradient backdrop paints immediately in its place.
- Software renderers get one static frame instead of a loop.
- DOM trimmed from 1007 to 745 elements by cutting decorative SVG circles.

**This is worth re-measuring on real hardware** (PageSpeed Insights against
the deployed URL) before treating 83 as the real number. My expectation is
that it clears 85 once a GPU is doing the rasterizing, but I could not prove
that here and am not going to claim a number I did not measure.

### JavaScript budget — over, for the same reason

**266 KB gzipped** against your ~250 KB target. three.js is 126 KB of that;
React and the Next runtime are ~140 KB.

**There is a conflict in the brief here that I could not resolve on my
own.** You asked for three.js, and you asked for < 250 KB and ≥ 85. For a
scene that is a single `Points` draw call, those pull in opposite
directions. I kept three.js because you named it explicitly, and deferred it
so it blocks nothing.

**If you would rather have the numbers:** replacing three.js with ~150 lines
of hand-written WebGL (one program, one buffer, one draw call — the shaders
are already written and would carry over unchanged) would drop total JS to
roughly 140 KB and remove the parse cost, putting both targets comfortably
in reach. It is a contained change to one file. Say the word.

### Loading screen

The 3.5s splash you asked for is in. Being honest about the trade-off: it
covers the hero for 3.5 seconds, which works against the same performance
targets above and against conversion on a page whose job is to get a busy
practice owner to a booking form.

It is built to do as little damage as possible — pure CSS, server-rendered,
zero JavaScript, `pointer-events: none` so scrolling and clicking work
straight through it, and it clears itself even if scripts fail. Duration is
one number in `globals.css` if you want it shorter.

Measured cost: mobile Performance went 83 → 82 and LCP 2.5 s → 2.9 s. Small,
because the hero is painted behind the overlay the whole time rather than
being withheld. The brain silhouette is a 14 KB gzipped SVG.

---

## 6. Smaller calls

- **Deploy target: Cloudflare Workers** (changed from the original Vercel
  plan once you pointed at the existing `clinician--marketing` Worker). See
  section 7.
- **Email via Resend**, chosen for a plain HTTPS API with no SDK dependency.
  Swapping providers means editing one `fetch` in
  `src/app/api/contact/route.ts`.
- **Contact form hardening:** honeypot field, per-instance rate limit of 5
  submissions per minute per IP, length caps on every field, HTML escaping
  on everything interpolated into the email.
- **No PHI by design.** The form collects business contact details only and
  says so under the fields. Do not add fields that could carry clinical
  information without a BAA in place with the mail provider first.
- **"Services" and "Pricing" are separate anchors.** Your nav listed both,
  but the brief's section 4 merged offerings and pricing. I split them: a
  six-item services overview, then the plan cards. A practice owner wants to
  know what you actually do before seeing a number.
- **Supporting imagery is CSS/SVG**, not Higgsfield-generated. The connector
  was available, but abstract dot-field motifs built from the same geometry
  as the hero keep the page reading as one system, cost nothing to load, and
  scale cleanly. No stock photography, no clip art, as instructed.
- **Open Graph image** is generated at `/opengraph-image` from the real
  baked point cloud at the hero's resting angle, so it stays in sync with
  the model.
- **No geography anywhere.** Checked: no city, state or regional reference
  in any copy, metadata or structured data. `areaServed` in the Service
  JSON-LD is "United States", which is a national claim rather than a
  regional one — remove it from `src/lib/structured-data.ts` if you would
  rather have nothing at all.
- **Monastic Marketing appears exactly once** in site copy: the final line
  of the footer. No logo, no nav link. (But see 1.2 — the booking widget
  currently breaks this.)
- **FAQ uses native `<details>`**, so it is keyboard accessible and works
  without JavaScript. It is also emitted as `FAQPage` JSON-LD.
- **Fonts:** Inter for display and body, JetBrains Mono for telemetry
  labels, both self-hosted by `next/font` with no external request.


---

## 7. Deployment

**Live at https://clinician.marketing**

Also serving on `www.clinician.marketing` and, as a fallback,
`https://clinician--marketing.tyler-cc9.workers.dev`.

Deployed to the existing `clinician--marketing` Cloudflare Worker using the
API token you supplied. The token was passed inline as an environment
variable for the deploy command only — it was never written to a file and
is not in the repository. **Rotate it now**, as you planned: it was pasted
in a chat transcript.

### How it is wired

The site is a Next.js app running on Workers through
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare):

- `wrangler.jsonc` — Worker name (matches the existing script, so routes and
  custom domains attached to it carry over), entrypoint `.open-next/worker.js`,
  static assets binding, `nodejs_compat`.
- `open-next.config.ts` — adapter defaults. Nothing to revalidate, so no
  cache backend is configured.

```bash
npm run deploy    # build the Worker bundle and deploy it
npm run preview   # run the real Worker locally via workerd
```

### Two things that bit during setup, documented so they do not recur

**1. Do not point `npm run build` at the adapter.** `opennextjs-cloudflare
build` invokes the project's own build script internally. Setting
`"build": "opennextjs-cloudflare build"` makes it call itself — it forks
until the machine falls over. `build` stays `next build`; the Worker bundle
is `build:cf`.

**2. Next is pinned to 16.3.8, not 16.4.0.** Next 16.4 emits a new
`.next/server/preview-props.json` manifest that `@opennextjs/cloudflare`
1.20.10 does not recognise, so its patched `loadManifest` throws and every
server-rendered route returns HTTP 500. Static assets still served, which
makes it look like a partial success — it is not. 16.3.8 is inside the
adapter's supported range (`>=16.3.8`), builds clean, and `npm audit`
reports zero vulnerabilities. **Do not bump Next past 16.3.x until the
adapter adds support**, and if you do, smoke-test an actual rendered route
rather than just the homepage asset.

### Workers Builds (push-to-deploy)

The first CI run failed at `Cloning repository...` with "error occurred
while fetching repository", one second in — before any build command ran.

Cause: the Worker was created at 01:25, when this repository had **no
commits and no branches at all**, so Cloudflare defaulted its production
branch to `main`, which did not exist. A `main` branch now exists and
tracks the same commit as `claude/charming-galileo-oqyuw6`.

For CI to actually build, the dashboard settings must be (Worker →
Settings → Build):

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx wrangler deploy` |

The default `npm run build` is **not** sufficient: it produces the Next
output but not `.open-next/worker.js`, so the deploy step then fails with a
missing entrypoint.

If the clone still fails after this, the other cause is the Cloudflare
GitHub App not having access to this repository — check
GitHub → Settings → Applications → Cloudflare Workers → Repository access.
The repo is public, but Workers Builds still clones through the app
installation rather than anonymously.

Note the GitHub default branch is still `claude/charming-galileo-oqyuw6`;
switch it to `main` in the repo settings if you want the tidier default.

### Custom domain

`clinician.marketing` and `www.clinician.marketing` are attached to the
Worker as custom domains, declared in `wrangler.jsonc` so deploys keep
them. Cloudflare is both the registrar and the DNS provider for this zone.

Two things worth knowing if this is ever rebuilt:

**Declaring `routes` silently disables the `*.workers.dev` URL.** It turned
the fallback hostname into a 404 while the custom domain was still waiting
on DNS, so the site was briefly unreachable on every hostname.
`"workers_dev": true` is now pinned in `wrangler.jsonc` to prevent that.

**The zone sat in `pending` for a while on a stale delegation.** The
registry already listed the correct nameserver pair (`koa`/`marjory`), but
resolvers were still serving a cached `braden`/`love` delegation with a
86400s TTL. It cleared on its own; the zone is now `active`. If a zone
looks stuck in `pending`, check the registry over RDAP rather than a
caching resolver before changing anything, and re-run the activation check:
`PUT /zones/{zone_id}/activation_check`.

Zone settings applied: `always_use_https` and `automatic_https_rewrites`
are on, so `http://` 301s to `https://`. SSL mode is Full.

`www` currently serves the site rather than redirecting to the apex. The
canonical tags all point at the apex so this is not an SEO problem, but a
single redirect rule would be tidier if you want one.

### Still to do on the Worker

- **Set the mail variables** (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
  `CONTACT_FROM_EMAIL`). Verified live: the contact endpoint currently
  returns `{"ok":true,"delivered":false}` — it accepts submissions and logs
  them, but **sends no email**, so enquiries are being dropped right now.
- **Attach the custom domain** `clinician.marketing` to the Worker.
- Analytics IDs if you want them.

These are all Worker dashboard settings; no code change is needed. Variables
set there are picked up on the next request, except `NEXT_PUBLIC_*` ones,
which are inlined at build time and need a redeploy (`npm run deploy`).

### Verified live on https://clinician.marketing

All routes return 200: `/`, `/privacy`, `/terms`, `/sitemap.xml`,
`/robots.txt`, `/opengraph-image` (PNG), the point-cloud binaries and the
brand SVGs. `/api/contact` returns 405 to GET and accepts POST. TLS
verifies, HTTP/2, and `http://` 301s to `https://`.

Canonical URLs, `og:url` and the sitemap all emit
`https://clinician.marketing`, confirmed in the served HTML.


---

## 8. Contact form removed, booking dialog added

The "Tell us what you are running" section, its form and the inline
calendar were removed at your request. Booking now happens in a dialog.

**How the dialog is wired.** Any link carrying `data-booking` opens it —
event delegation on the document, rather than a React context provider.
That matters because it keeps the hero, pricing and footer as server
components with no client bundle; only the dialog itself ships JavaScript.

Every trigger's `href` is the real scheduler URL with `target="_blank"`, so
the links work as ordinary links before hydration, if the JavaScript fails,
and on modified clicks (cmd/ctrl-click still opens a new tab). The dialog
is an enhancement, never the only route to booking.

It is built on the native `<dialog>` element with `showModal()`, which
provides focus trapping, Escape-to-close, inertness of the page behind and
top-layer painting without reimplementing any of it. The scheduler iframe
is only mounted after the dialog is first opened, so its scripts never load
for visitors who do not book. axe reports zero violations with the dialog
open, and focus lands on the close button.

**Knock-on changes:**

- `src/app/api/contact/route.ts` was deleted — nothing called it any more,
  and leaving an unauthenticated POST endpoint in place for no reason is a
  small liability. **`RESEND_API_KEY`, `CONTACT_TO_EMAIL` and
  `CONTACT_FROM_EMAIL` are no longer needed.** The earlier warning about
  the form silently dropping enquiries is resolved: there is no form.
- The site now has **no dynamic routes at all** — every route is
  prerendered static.
- "Contact" was dropped from the nav. It pointed at the section that no
  longer exists, and the "Let's chat" CTA sits immediately to its right.
  Email and phone remain in the footer and in the dialog's own footer.
  Say the word if you want the nav item back pointing at the dialog.


---

## 9. SEO pass and the blog

### Findings addressed

| Finding | Before | After |
| --- | --- | --- |
| Title too long | 675px (limit 580) | **437px** — "Behavioral Health Marketing \| Clinician Marketing" |
| Meta description too long | 1457px (limit 1000) | **869px**, 133 characters |
| H1 words absent from body | "scaled", "help", "yours" | all three now appear in body copy |
| Image with no usable alt | brain splash had `alt=""` | descriptive alt text |
| Too many headings | 43 for 1101 words | **28** for 1125 words |
| Duplicate anchor text | 7 duplicated strings | **0** |
| Both www and non-www served | both returned 200 | www **301s** to the apex |
| Response time | 0.61s reported | see below |

**How the heading count came down.** The credibility strip, the services
grid and the à la carte row were lists of term/definition pairs rendered
as headings. They are now `<dl>/<dt>/<dd>`, which is the more accurate
markup anyway, and the two footer column headings became paragraphs since
each `<nav>` already carries that text as its accessible name. No real
section heading was removed.

**How the duplicate anchors went.** The mobile menu rendered a second copy
of every nav link even while closed, so each appeared twice in the markup;
its links are now rendered only when the menu is open. Footer links got
their own wording ("Our services", "Plans and pricing"), and the CTAs that
all read "Let's chat" carry screen-reader-only suffixes naming what each
one books. That also satisfies WCAG 2.4.4 on distinguishing link purpose.

**A real bug this surfaced:** the nav anchors were `#services`, `#pricing`
and so on, which resolve to nothing from any page that is not the
homepage. They are now `/#services`, so the nav works from `/blog`,
`/privacy` and `/terms`.

### Response time: the site is now fully static

Measuring from this container is unreliable — a plain static asset that
never touches a Worker measured anywhere from 0.19s to 0.80s, so the
numbers here are dominated by the agent proxy rather than by the site.

Rather than tune against an unreliable measurement, the architecture
changed to remove the variable entirely. Every route was already
prerendered and the last dynamic route (the contact endpoint) is gone, so
the site now builds with `output: "export"` and deploys as a **pure
static-assets Worker** — `wrangler.jsonc` has no `main`, so no script runs
on a page request and Cloudflare serves the files from its edge.

That is visible in the response headers: requests now return
`cf-cache-status: HIT`, which they never did before, because responses
produced by a Worker are not edge-cacheable. Measured TTFB from this
container dropped from 0.22–1.07s to **0.15–0.34s**.

Consequences worth knowing:

- `@opennextjs/cloudflare` and `open-next.config.ts` are gone. The Next
  16.3.8 pin can be relaxed now — that pin only existed because of the
  adapter — but there is no reason to rush it.
- `headers()` in `next.config.ts` does nothing under `output: export`.
  Caching and security headers live in **`public/_headers`**, which
  Cloudflare Workers Static Assets reads.
- Next emits the Open Graph card as an extensionless file, so Cloudflare
  served it with **no content-type** and social scrapers would have
  rejected it. `public/_headers` sets `Content-Type: image/png` for it.
- Adding any server-side route again means reinstating the adapter.

Two Cloudflare rules were added: a dynamic redirect sending
`www.clinician.marketing` to the apex with the path preserved, and a cache
rule allowing HTML to be cached at the edge.

### The blog

`/blog` plus `/blog/behavioral-health-marketing-laws`, from the supplied
markdown. 4,469 words, 36 headings, a 14-item contents list, 52 footnote
markers linked to 43 numbered references. axe reports zero violations on
both pages.

Articles live in `src/content/posts/` as plain Markdown inside a template
literal, with metadata alongside. `src/lib/markdown.ts` renders them at
build time — `marked` never reaches the browser — and adds heading ids,
turns `[^3]` into a superscript link, and gives the reference list items
matching ids.

The article's meta title is set **absolutely**, bypassing the sitewide
"· Clinician Marketing" suffix, which would otherwise have pushed it back
over the 580px limit.

**Not done:** the blog is linked from the footer but not the main nav. For
crawl depth a nav link is better; it was left out because the nav items
were specified and I did not want to change them unasked.

### "GOP to IOP"

Changed as requested: the à la carte item now reads "Done-for-you GOP to
IOP program build". Flagging once — **"GOP" is not a standard behavioral
health abbreviation** the way OP, IOP and PHP are, and the services
section still says "OP-to-IOP expansion", so the two now disagree. If GOP
is deliberate house terminology, say so and I will align the other
mention; if it was meant to be "OP to IOP", it is one line in
`content.ts`.
