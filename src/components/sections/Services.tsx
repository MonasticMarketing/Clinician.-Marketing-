import Section from "@/components/Section";
import { content } from "@/content/content";

export default function Services() {
  const { services } = content;

  return (
    <Section
      id={services.id}
      eyebrow={services.eyebrow}
      heading={services.heading}
      intro={services.intro}
    >
      {/* Term/definition pairs, so a description list rather than six
          more headings. */}
      <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {services.items.map((item) => (
          <div
            key={item.title}
            className="bg-[rgb(9_14_40/0.92)] p-6 transition-colors duration-200 hover:bg-[rgb(13_20_58/0.92)] sm:p-7"
          >
            <dt className="text-base font-semibold text-[var(--white)]">
              {item.title}
            </dt>
            <dd className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
              {item.body}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
