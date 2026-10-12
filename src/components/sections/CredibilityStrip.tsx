import { content } from "@/content/content";

export default function CredibilityStrip() {
  const { credibility } = content;

  return (
    <section
      aria-labelledby="credibility-heading"
      className="relative border-y border-white/10"
      style={{ background: "rgb(7 11 31 / 0.93)" }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 id="credibility-heading" className="sr-only">
          {credibility.heading}
        </h2>

        <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {credibility.items.map((item, index) => (
            <li key={item.title} className="relative">
              <span
                aria-hidden="true"
                className="font-mono text-[0.7rem] tracking-[0.18em] text-[var(--glow)]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-[0.95rem] font-semibold text-[var(--white)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
