"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { content } from "@/content/content";

/**
 * Centred booking dialog holding the scheduling embed.
 *
 * Opening is driven by event delegation rather than by a provider: any
 * link anywhere on the page carrying `data-booking` opens it, so the
 * sections that render it stay server components with no client bundle.
 *
 * Those links point at the booking URL directly, so without JavaScript —
 * or before hydration — they still work as ordinary links to the
 * scheduler. The dialog is an enhancement, never the only route.
 *
 * Built on <dialog>.showModal(), which gives focus trapping, Escape to
 * close, inertness of the page behind and top-layer painting for free,
 * rather than reimplementing all of that.
 */
export default function BookingModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // The iframe is only mounted once the dialog has been opened, so the
  // scheduler's scripts never load for visitors who do not book.
  const [hasOpened, setHasOpened] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      // Let modified clicks behave normally — the href is a real URL, so
      // cmd/ctrl-click should open the scheduler in a new tab.
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>("[data-booking]");
      if (!trigger) return;

      const dialog = dialogRef.current;
      if (!dialog || typeof dialog.showModal !== "function") return;

      event.preventDefault();
      setHasOpened(true);
      setIsOpen(true);
      if (!dialog.open) dialog.showModal();
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClose = () => setIsOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // Lock background scrolling only while the dialog is actually open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="booking-title"
      className="booking-dialog"
      // Clicking the backdrop closes. Clicks inside the panel stop here.
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <div className="booking-panel">
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 sm:px-6">
          <div>
            <h2
              id="booking-title"
              className="text-lg font-semibold text-[var(--white)]"
            >
              {content.booking.heading}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {content.booking.body}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            className="-mt-1 -mr-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-[var(--white)] transition-colors hover:bg-white/10"
          >
            <span className="sr-only">Close</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <div className="booking-frame">
          {hasOpened ? (
            <iframe
              src={content.scheduler.embedUrl}
              title={content.scheduler.title}
              className="bg-white"
              allow="camera; microphone; fullscreen; payment"
            />
          ) : null}
        </div>

        <p className="px-5 pt-3 pb-5 text-xs text-[var(--muted)] sm:px-6">
          {content.booking.footnote}{" "}
          <a
            href={`tel:${content.brand.phoneHref}`}
            className="text-[var(--glow)] underline-offset-4 hover:underline"
          >
            {content.brand.phone}
          </a>
          {" · "}
          <a
            href={`mailto:${content.brand.email}`}
            className="text-[var(--glow)] underline-offset-4 hover:underline"
          >
            {content.brand.email}
          </a>
        </p>
      </div>
    </dialog>
  );
}
