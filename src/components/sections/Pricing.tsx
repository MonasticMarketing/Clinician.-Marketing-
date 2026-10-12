import Link from "next/link";

import Section from "@/components/Section";
import { content } from "@/content/content";

function Check() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-[0.3rem] h-3.5 w-3.5 shrink-0 text-[var(--glow)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.2 3.2L13 5" />
    </svg>
  );
}

export default function Pricing() {
  const { pricing, nav } = content;

  return (
    <Section
      id={pricing.id}
      eyebrow={pricing.eyebrow}
      heading={pricing.heading}
      intro={pricing.intro}
    >
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {pricing.plans.map((plan) => (
          <article
            key={plan.id}
            aria-labelledby={`plan-${plan.id}`}
            className={`card-surface relative flex flex-col rounded-2xl p-7 ${
              plan.featured ? "bloom border-[var(--glow)]/35" : ""
            }`}
          >
            {plan.featured ? (
              <span className="absolute -top-3 left-7 rounded-full bg-[var(--glow)] px-3 py-1 font-mono text-[0.62rem] tracking-[0.14em] text-[#140a2e] uppercase">
                Most chosen
              </span>
            ) : null}

            <h3
              id={`plan-${plan.id}`}
              className="text-lg font-semibold text-[var(--white)]"
            >
              {plan.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {plan.audience}
            </p>

            <div className="mt-6 border-y border-white/10 py-5">
              <p className="text-2xl font-semibold tracking-tight text-[var(--white)]">
                {plan.price}
              </p>
              {plan.priceNote ? (
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {plan.priceNote}
                </p>
              ) : null}
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2.5">
                  <Check />
                  <span className="text-sm leading-relaxed text-[var(--muted-strong)]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={nav.cta.href}
              className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] ${
                plan.featured
                  ? "bg-[var(--white)] text-[#0a0f2b]"
                  : "border border-white/20 bg-white/[0.04] text-[var(--white)] hover:border-white/40"
              }`}
            >
              {plan.cta}
              <span className="sr-only"> — {plan.name}</span>
            </a>
          </article>
        ))}
      </div>

      {/* Ad spend footnote and guarantee terms link. */}
      <div className="mt-7 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-[var(--white)]">
          <span aria-hidden="true" className="mr-2 text-[var(--glow)]">
            *
          </span>
          {pricing.footnote}
        </p>
        <Link
          href={pricing.guaranteeTermsHref}
          className="text-[var(--glow)] underline underline-offset-4 hover:text-[var(--white)]"
        >
          {pricing.guaranteeTermsLabel}
        </Link>
      </div>

      {/* Custom and à la carte row. */}
      <div className="card-surface mt-10 rounded-2xl p-7 sm:p-8">
        <h3 className="text-lg font-semibold text-[var(--white)]">
          {pricing.alaCarte.heading}
        </h3>
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {pricing.alaCarte.items.map((item) => (
            <li
              key={item.title}
              className="border-t border-white/10 pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-6 md:first:border-l-0 md:first:pl-0"
            >
              <h4 className="text-[0.95rem] font-semibold text-[var(--white)]">
                {item.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {item.body}
              </p>
              <p className="mt-3 font-mono text-[0.8rem] text-[var(--glow)]">
                {item.price}
              </p>
            </li>
          ))}
        </ul>
        <a
          href={content.nav.cta.href}
          className="mt-7 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-[var(--white)] transition-colors hover:border-white/40"
        >
          Book a Call
        </a>
      </div>
    </Section>
  );
}
