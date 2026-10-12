import Section from "@/components/Section";
import { content } from "@/content/content";

/**
 * Native details/summary: keyboard accessible, works without JavaScript,
 * and announces expanded state to screen readers with no ARIA wiring.
 */
export default function Faq() {
  const { faq } = content;

  return (
    <Section id={faq.id} eyebrow={faq.eyebrow} heading={faq.heading}>
      <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
        {faq.items.map((item) => (
          <details key={item.question} className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
              <h3 className="text-base font-medium text-[var(--white)] sm:text-lg">
                {item.question}
              </h3>
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 text-[var(--glow)] transition-transform duration-200 group-open:rotate-45"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M8 3v10M3 8h10" />
                </svg>
              </span>
            </summary>
            <p className="max-w-3xl pr-10 pb-6 text-sm leading-relaxed text-[var(--muted-strong)]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
