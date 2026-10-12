import Link from "next/link";

import Wordmark from "@/components/Wordmark";
import { content } from "@/content/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-white/10 backdrop-blur-[10px]"
      style={{
        // Firm almost immediately: footer links sit low on the page where
        // the point cloud is still bright behind them.
        background:
          "linear-gradient(to bottom, rgb(7 11 31 / 0.55) 0%, rgb(7 11 31 / 0.95) 7%, rgb(7 11 31 / 0.97) 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,1fr))]">
          <div className="max-w-sm">
            <Wordmark height="1.5rem" />
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              {content.footer.tagline}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={`mailto:${content.brand.email}`}
                className="text-sm font-medium text-[var(--glow)] underline-offset-4 hover:underline"
              >
                {content.brand.email}
              </a>
              <a
                href={`tel:${content.brand.phoneHref}`}
                className="text-sm font-medium text-[var(--glow)] underline-offset-4 hover:underline"
              >
                {content.brand.phone}
              </a>
            </div>
          </div>

          {content.footer.columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              {/* The <nav> already carries this as its accessible name, so
                  a heading here would only pad the page's heading count. */}
              <p className="font-mono text-[0.7rem] tracking-[0.18em] text-[var(--muted)] uppercase">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        data-booking
                        target="_blank"
                        rel="noopener"
                        className="text-sm text-[var(--muted-strong)] transition-colors hover:text-[var(--white)]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--muted-strong)] transition-colors hover:text-[var(--white)]"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {content.brand.name}. All rights reserved.
          </p>
          {/* The only mention of the parent company anywhere on the site. */}
          <p>{content.brand.parentCompanyLine}</p>
        </div>
      </div>
    </footer>
  );
}
