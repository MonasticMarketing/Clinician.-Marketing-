# Decisions and open items

Every judgment call made during the build, and everything still waiting on
you. Read the first section before launch — nothing there should ship as-is.

---

## 1. NEEDS YOUR REVIEW BEFORE LAUNCH

### 1.1 The M logo is a hand-traced reconstruction

**`public/brand/m-logo.svg` is not your original vector.** The file you sent
arrived as a rendered image rather than as a file this environment could
read, so I traced the mark by eye from it. It is visually very close and
reads correctly at nav size, but it will not be geometrically exact.

**Action:** replace `public/brand/m-logo.svg` with the original vector,
keeping the path and filename. Crop its `viewBox` tight to the glyph so the
baseline alignment in `Wordmark.tsx` keeps working. Nothing else changes.

### 1.2 The booking widget is Monastic-branded

Your brief says Monastic Marketing appears only in the footer small print —
no Monastic logo anywhere. The booking widget you supplied
(`link.bemonastic.com/widget/booking/dVVauiWwgIOGGnY719c2`) currently
renders **the Monastic Marketing logo and the title "Monastic 30-minute
Call"** inside the contact section.

This is a GoHighLevel setting, not something the site can override.

**Action, in your GHL account:**
- Rename the calendar (e.g. "Clinician Marketing — 30-minute Call").
- Replace the logo on the booking widget with the Clinician Marketing mark.
- Optionally white-label the domain so the URL is not `bemonastic.com`.

The embed URL lives at `content.scheduler.embedUrl` in
`src/content/content.ts` if it changes.

### 1.3 Guarantee terms are placeholder legal text

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

### 1.4 Privacy notice is placeholder

`/privacy` has bracketed gaps for your vendor list, retention period, and
which state privacy laws apply. Same visible draft banner.

### 1.5 Plan 3 has no price

As you noted, no figure was given for Enterprise / Multi-location. It shows
**"Call for pricing"** with a "Let's chat" CTA. Set `price` on the
`enterprise` plan in `content.ts` when you have a number.

### 1.6 The founders' story is written blind

`content.about.paragraphs` uses "our founders" throughout and names nobody,
as instructed. The specifics — hiring and losing clinicians, carrying
payroll through a slow quarter, an intake line going unanswered — are
**plausible invented detail, not facts I was given.** Read it and replace
anything that is not true of you.

### 1.7 Contact details

- **Phone** — `(972) 366-4899`, as supplied. Live in the footer and the
  contact section.
- **Email** — `hello@clinician.marketing` is **my invention**. Change
  `content.brand.email` if it is wrong, and make sure the mailbox exists.
- **Domain** — I assumed `https://clinician.marketing`. Set
  `NEXT_PUBLIC_SITE_URL` to the real one; metadata, sitemap and JSON-LD all
  follow it.

### 1.8 "who have ran what you run"

You asked for "ran", so that is what ships. Flagging once and then leaving
it alone: **"have ran" is not standard English** — the past participle of
"run" is "run". Given the audience is skeptical practice owners and the
brand voice is "clinical-grade", a grammar slip in the single biggest line
of type on the site is the kind of thing that costs credibility.

If the goal was to avoid the repetition of "run … run", these keep the
rhythm and stay correct:

- "Marketing built by people who have run what you run."
- "Marketing built by people who have run a practice like yours."
- "Built by people who have sat in your chair."

One line in `content.hero.headline` either way.

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

- **Deploy target: Vercel.** The Cloudflare connector is present in this
  session, but it only exposes D1, KV, R2 and Workers *reads* — there is no
  Pages deploy tool, so I could not have deployed there even if we wanted
  to. Cloudflare would additionally need the Next-on-Pages adapter and an
  edge-runtime change on the contact route. Vercel needs neither.
- **Nothing is deployed.** No hosting credentials were available in this
  session. The build is production-ready; see README for the steps.
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
