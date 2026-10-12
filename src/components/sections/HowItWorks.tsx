import Section from "@/components/Section";
import { content } from "@/content/content";

export default function HowItWorks() {
  const { howItWorks } = content;

  return (
    <Section
      id={howItWorks.id}
      eyebrow={howItWorks.eyebrow}
      heading={howItWorks.heading}
    >
      <ol className="mt-14 grid gap-5 md:grid-cols-3">
        {howItWorks.steps.map((step) => (
          <li
            key={step.number}
            className="card-surface relative rounded-2xl p-7"
          >
            <span
              aria-hidden="true"
              className="font-mono text-[0.75rem] tracking-[0.18em] text-[var(--glow)]"
            >
              {step.number}
            </span>
            <h3 className="mt-4 text-xl font-semibold text-[var(--white)]">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
