import Section from "@/components/Section";
import { content } from "@/content/content";

/**
 * Abstract card motifs in the brand palette — no stock photography, no
 * clip art. Each is a different arrangement of the same dot-field idea
 * that drives the hero, so the page reads as one system.
 */
function CardMotif({ variant }: { variant: number }) {
  const dots: { cx: number; cy: number; r: number; o: number }[] = [];
  // Deterministic scatter: same output on server and client. Kept to a
  // small count — these are 56px decorations, and four of them on the page
  // add up fast in the DOM.
  const count = 24;
  for (let i = 0; i < count; i++) {
    const a = i * 2.399963 + variant * 1.7;
    const radius = 6 + (i / count) * 30;
    dots.push({
      cx: 40 + Math.cos(a) * radius * (variant % 2 === 0 ? 1.25 : 0.9),
      cy: 40 + Math.sin(a) * radius * (variant % 2 === 0 ? 0.7 : 1.05),
      r: 0.9 + ((i * 7) % 5) * 0.3,
      o: 0.3 + ((i * 13) % 7) / 10,
    });
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 80"
      className="h-14 w-14 shrink-0"
      fill="none"
    >
      <defs>
        <radialGradient id={`motif-${variant}`} cx="50%" cy="45%">
          <stop offset="0%" stopColor="#F5F7FF" />
          <stop offset="55%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </radialGradient>
      </defs>
      {dots.map((dot, i) => (
        <circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r={dot.r}
          fill={`url(#motif-${variant})`}
          opacity={dot.o}
        />
      ))}
    </svg>
  );
}

export default function WhoWeServe() {
  const { whoWeServe } = content;

  return (
    <Section
      id={whoWeServe.id}
      eyebrow={whoWeServe.eyebrow}
      heading={whoWeServe.heading}
      intro={whoWeServe.intro}
    >
      <ul className="mt-14 grid gap-5 sm:grid-cols-2">
        {whoWeServe.cards.map((card, index) => (
          <li
            key={card.title}
            className="card-surface bloom relative flex gap-5 rounded-2xl p-6 sm:p-7"
          >
            <CardMotif variant={index} />
            <div>
              <h3 className="text-lg font-semibold text-[var(--white)]">
                {card.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
                {card.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
