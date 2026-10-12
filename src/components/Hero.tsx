import { content } from "@/content/content";

/**
 * Hero. Deliberately carries no scrim so the point cloud reads at full
 * strength here; every section below it dims the brain as it passes over.
 */

/** Desktop placement of the telemetry labels around the point cloud. */
const TELEMETRY_POSITIONS = [
  "top-[12%] right-[4%]",
  "top-[44%] right-[1.5%]",
  "bottom-[26%] right-[30%]",
  "bottom-[9%] right-[6%]",
];

export default function Hero() {
  const { hero } = content;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-10 pb-24"
    >
      {/* Soft scrim under the text column so body copy keeps AA contrast
          over the point cloud without hiding it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          // Clear at the top so the brain reads as the page's backdrop,
          // then firm enough from the headline down to hold AA contrast.
          background:
            "linear-gradient(to bottom, rgb(7 11 31 / 0.18) 0%, rgb(7 11 31 / 0.5) 16%, rgb(7 11 31 / 0.88) 27%, rgb(7 11 31 / 0.91) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[60%] lg:block"
        style={{
          background:
            "linear-gradient(to right, rgb(7 11 31 / 0.93) 0%, rgb(7 11 31 / 0.86) 48%, rgb(7 11 31 / 0.4) 80%, rgb(7 11 31 / 0) 100%)",
        }}
      />

      {/* Telemetry labels, floating near the brain on wide screens. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {hero.telemetry.map((item, index) => (
          <div
            key={item.value}
            className={`absolute ${TELEMETRY_POSITIONS[index]} flex items-center gap-2.5`}
          >
            <span className="h-px w-7 bg-gradient-to-r from-transparent to-[var(--glow)]/70" />
            <span className="rounded-sm bg-[rgb(7_11_31/0.62)] px-2 py-1 font-mono text-[0.7rem] leading-tight tracking-[0.04em] whitespace-nowrap backdrop-blur-[3px]">
              <span className="text-[var(--glow)]">{item.value}</span>
              <span className="text-[var(--muted-strong)]"> — {item.label}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-[0.7rem] tracking-[0.2em] text-[var(--glow)] uppercase">
            {hero.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="mt-6 text-[2.5rem] leading-[1.05] font-semibold sm:text-6xl lg:text-[4.25rem]"
          >
            <span className="gradient-text">{hero.headline}</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-[var(--muted-strong)] sm:text-lg">
            {hero.subhead}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={hero.primaryCta.href}
              className="inline-flex items-center justify-center rounded-full bg-[var(--white)] px-7 py-3.5 text-sm font-semibold text-[#0a0f2b] transition-transform duration-200 hover:scale-[1.03]"
            >
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-[var(--white)] backdrop-blur-sm transition-colors duration-200 hover:border-white/40 hover:bg-white/[0.07]"
            >
              {hero.secondaryCta.label}
            </a>
          </div>

          {/* Same telemetry, stacked, for screens too narrow to float it. */}
          <ul className="mt-12 grid gap-2.5 lg:hidden">
            {hero.telemetry.map((item) => (
              <li
                key={item.value}
                className="flex items-baseline gap-2 font-mono text-[0.7rem] tracking-[0.04em]"
              >
                <span aria-hidden="true" className="h-px w-4 bg-[var(--glow)]/60" />
                <span className="text-[var(--glow)]">{item.value}</span>
                <span className="text-[var(--muted)]">— {item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="font-mono text-[0.65rem] tracking-[0.2em] text-[var(--muted)] uppercase">
          Scroll
        </span>
      </div>
    </section>
  );
}
