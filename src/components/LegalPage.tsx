import Link from "next/link";
import type { ReactNode } from "react";

/** Shared shell for /privacy and /terms. */
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div
      className="relative"
      style={{
        background:
          "linear-gradient(to bottom, rgb(7 11 31 / 0.82) 0%, rgb(7 11 31 / 0.95) 18%, rgb(7 11 31 / 0.96) 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <Link
          href="/"
          className="font-mono text-[0.7rem] tracking-[0.16em] text-[var(--glow)] uppercase hover:underline"
        >
          ← Back to site
        </Link>

        <h1 className="mt-8 text-3xl font-semibold sm:text-4xl">{title}</h1>
        <p className="mt-3 font-mono text-[0.72rem] tracking-[0.1em] text-[var(--muted)] uppercase">
          Last updated {updated}
        </p>

        <div
          className={[
            "mt-12 space-y-6",
            "[&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--white)]",
            "[&_h3]:mt-8 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[var(--white)]",
            "[&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-[var(--muted-strong)]",
            "[&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-[var(--muted-strong)]",
            "[&_ul]:mt-3 [&_ul]:space-y-2.5 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:marker:text-[var(--glow)]",
            "[&_a]:text-[var(--glow)] [&_a]:underline [&_a]:underline-offset-4",
            "[&_strong]:text-[var(--white)]",
          ].join(" ")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
