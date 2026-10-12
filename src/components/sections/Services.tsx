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
      <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {services.items.map((item) => (
          <li
            key={item.title}
            className="bg-[rgb(9_14_40/0.92)] p-6 transition-colors duration-200 hover:bg-[rgb(13_20_58/0.92)] sm:p-7"
          >
            <h3 className="text-base font-semibold text-[var(--white)]">
              {item.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
