"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Wordmark from "@/components/Wordmark";
import { content } from "@/content/content";

/**
 * Sticky nav: transparent over the hero, solid once the page scrolls.
 * The mobile menu is a plain disclosure so it works without JavaScript
 * hydration order mattering, and traps nothing — Escape and outside
 * navigation both close it.
 */
export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let queued = false;

    const read = () => {
      queued = false;
      setScrolled(window.scrollY > 24);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-white/10 bg-[rgb(7_11_31/0.95)] backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="flex items-center" aria-label={content.brand.name}>
          <Wordmark height="1.65rem" />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {content.nav.items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-[var(--muted-strong)] transition-colors hover:text-[var(--white)]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={content.nav.cta.href}
            data-booking
            target="_blank"
            rel="noopener"
            className="hidden rounded-full bg-[var(--white)] px-4 py-2 text-sm font-semibold text-[#0a0f2b] transition-transform duration-200 hover:scale-[1.03] sm:inline-flex"
          >
            {content.nav.cta.label}
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-[var(--white)] md:hidden"
          >
            <span className="sr-only">
              {open ? "Close menu" : "Open menu"}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <path d="M5 5l10 10" />
                  <path d="M15 5L5 15" />
                </>
              ) : (
                <>
                  <path d="M3 6h14" />
                  <path d="M3 10h14" />
                  <path d="M3 14h14" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-white/10 bg-[rgb(7_11_31/0.96)] md:hidden"
      >
        <ul className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          {content.nav.items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-3 text-base text-[var(--muted-strong)] transition-colors hover:text-[var(--white)]"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="pt-2 pb-1">
            <a
              href={content.nav.cta.href}
              data-booking
              target="_blank"
              rel="noopener"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-[var(--white)] px-4 py-3 text-center text-sm font-semibold text-[#0a0f2b]"
            >
              {content.nav.cta.label}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
