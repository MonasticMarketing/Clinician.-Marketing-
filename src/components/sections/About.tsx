import Section from "@/components/Section";
import { content } from "@/content/content";

export default function About() {
  const { about } = content;

  return (
    <Section id={about.id} eyebrow={about.eyebrow} heading={about.heading}>
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-5">
          {about.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 28)}
              className="text-base leading-relaxed text-[var(--muted-strong)]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Abstract operator motif: two overlapping dot fields converging. */}
        <div className="card-surface bloom relative overflow-hidden rounded-2xl p-8">
          <svg
            aria-hidden="true"
            viewBox="0 0 200 140"
            className="h-auto w-full"
            fill="none"
          >
            <defs>
              <linearGradient id="about-a" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
            </defs>
            {/* Two converging dot fields. Kept to a modest count — this is
                decoration, and every circle is a DOM node. */}
            {[0, 1].map((lobe) =>
              Array.from({ length: 55 }, (_, i) => {
                const a = i * 2.399963 + lobe * 0.9;
                const t = i / 55;
                const r = 8 + t * 46;
                return (
                  <circle
                    key={`${lobe}-${i}`}
                    cx={(lobe ? 132 : 70) + Math.cos(a) * r * 1.1}
                    cy={70 + Math.sin(a) * r * 0.78}
                    r={1 + ((i * (lobe ? 3 : 5)) % 4) * 0.28}
                    fill="url(#about-a)"
                    opacity={0.25 + (1 - t) * 0.6}
                  />
                );
              }),
            )}
          </svg>
          <p className="mt-6 font-mono text-[0.7rem] leading-relaxed tracking-[0.1em] text-[var(--muted)] uppercase">
            Practice operations · Facility operations · Growth
          </p>
        </div>
      </div>
    </Section>
  );
}
