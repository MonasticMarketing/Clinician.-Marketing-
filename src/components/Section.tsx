import type { ReactNode } from "react";

/**
 * Standard content block that scrolls over the fixed brain.
 *
 * The background is a vertical scrim that is firm through the middle,
 * where the copy sits, and softens at both edges. Stacked sections
 * therefore leave a lighter band between them where the point cloud shows
 * through clearly, which is what keeps the page reading as text moving
 * over a living brain rather than over a flat panel.
 *
 * Contrast does not depend on backdrop-filter: the firm band is opaque
 * enough for WCAG AA on its own, and the blur is an enhancement where the
 * browser supports it.
 */

const SCRIM =
  "linear-gradient(to bottom, rgb(7 11 31 / 0.45) 0%, rgb(7 11 31 / 0.93) 13%, rgb(7 11 31 / 0.94) 87%, rgb(7 11 31 / 0.45) 100%)";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  children: ReactNode;
  /** Renders the heading block centered instead of left-aligned. */
  centered?: boolean;
  headingId?: string;
};

export default function Section({
  id,
  eyebrow,
  heading,
  intro,
  children,
  centered = false,
  headingId,
}: SectionProps) {
  const resolvedHeadingId = headingId ?? (id ? `${id}-heading` : undefined);

  return (
    <section
      id={id}
      aria-labelledby={heading ? resolvedHeadingId : undefined}
      className="relative scroll-mt-24"
      style={{ background: SCRIM }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 backdrop-blur-[10px]"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 13%, black 87%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 13%, black 87%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
        {heading ? (
          <header className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
            {eyebrow ? (
              <p className="font-mono text-[0.7rem] tracking-[0.2em] text-[var(--glow)] uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h2
              id={resolvedHeadingId}
              className="mt-4 text-3xl leading-tight font-semibold sm:text-4xl"
            >
              {heading}
            </h2>
            {intro ? (
              <p className="mt-5 text-base leading-relaxed text-[var(--muted-strong)]">
                {intro}
              </p>
            ) : null}
          </header>
        ) : null}

        {children}
      </div>
    </section>
  );
}
