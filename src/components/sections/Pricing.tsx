import Link from "next/link";

import Section from "@/components/Section";
import { content } from "@/content/content";

/**
 * One offer, so there is no plan grid to compare across. The section is
 * split instead: the case on the left, the price on the right, which is
 * the order a skeptical buyer reads them in.
 */
export default function Pricing() {
  const { pricing, nav } = content;

  return (
    <Section
      id={pricing.id}
      eyebrow={pricing.eyebrow}
      heading={pricing.heading}
      intro={pricing.intro}
    >
      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        {/* Why it works. */}
        <div className="card-surface rounded-2xl p-7 sm:p-9">
          <h3 className="font-mono text-[0.7rem] tracking-[0.18em] text-[var(--glow)] uppercase">
            {pricing.reasonsHeading}
          </h3>
          <ul className="mt-7 space-y-5">
            {pricing.reasons.map((reason) => (
              <li
                key={reason}
                className="flex gap-3.5 border-t border-white/10 pt-5 first:border-t-0 first:pt-0"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.45rem] h-2 w-2 shrink-0 rounded-full bg-[var(--glow)]"
                />
                <span className="text-[0.95rem] leading-relaxed text-[var(--muted-strong)]">
                  {reason}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* The price. */}
        <div className="bloom card-surface relative rounded-2xl border-[var(--glow)]/35 p-7 sm:p-9">
          <dl>
            {pricing.priceLines.map((line, index) => (
              <div
                key={line.id}
                className={
                  index > 0 ? "mt-8 border-t border-white/10 pt-8" : undefined
                }
              >
                <dt className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-[2.75rem] leading-none font-semibold tracking-tight text-[var(--white)] sm:text-[3.25rem]">
                    {line.amount}
                  </span>
                  <span className="text-base text-[var(--muted-strong)]">
                    {line.unit}
                  </span>
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {line.body}
                </dd>
              </div>
            ))}
          </dl>

          <a
            href={nav.cta.href}
            data-booking
            target="_blank"
            rel="noopener"
            className="mt-9 inline-flex items-center justify-center rounded-full bg-[var(--white)] px-6 py-3 text-sm font-semibold text-[#0a0f2b] transition-transform duration-200 hover:scale-[1.02]"
          >
            {pricing.cta}
            <span className="sr-only"> — about the done-for-you system</span>
          </a>
        </div>
      </div>

      {/* Ad spend footnote and guarantee terms link. */}
      <div className="mt-7 flex flex-col gap-2 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <p className="text-[var(--muted-strong)]">
          <span className="font-medium text-[var(--white)]">
            {pricing.footnoteLead}
          </span>{" "}
          {pricing.footnote}
        </p>
        <Link
          href={pricing.guaranteeTermsHref}
          className="shrink-0 text-[var(--glow)] underline underline-offset-4 hover:text-[var(--white)]"
        >
          {pricing.guaranteeTermsLabel}
        </Link>
      </div>
    </Section>
  );
}
