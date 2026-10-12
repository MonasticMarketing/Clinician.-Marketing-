"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Fixed visual layer behind the whole page.
 *
 * The gradient is plain CSS on a server-rendered element, so the hero has
 * its backdrop in the very first paint. The WebGL canvas — and the ~126 KB
 * of three.js behind it — is a separate chunk that is not even requested
 * until the browser goes idle or the visitor interacts, which keeps it off
 * the critical path and out of time-to-interactive entirely.
 *
 * If WebGL is unavailable or the chunk never arrives, this gradient is
 * what remains, and the page still looks deliberate.
 */
const BrainField = dynamic(() => import("@/components/BrainField"), {
  ssr: false,
});

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export default function BrainBackdrop() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idleWindow = window as IdleWindow;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;

    const start = () => {
      cleanup();
      setReady(true);
    };

    // Any real interaction means the visitor is here and engaged — bring
    // the canvas in immediately rather than waiting out the idle timer.
    const events = ["pointerdown", "pointermove", "touchstart", "wheel"] as const;

    function cleanup() {
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle);
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
      for (const event of events) window.removeEventListener(event, start);
    }

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleHandle = idleWindow.requestIdleCallback(start, { timeout: 2500 });
    } else {
      timeoutHandle = window.setTimeout(start, 1200);
    }

    for (const event of events) {
      window.addEventListener(event, start, { passive: true, once: true });
    }

    return cleanup;
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-[100dvh] w-full"
      style={{
        background:
          "radial-gradient(90% 70% at 62% 42%, rgb(11 19 64 / 0.95) 0%, rgb(7 11 31 / 1) 62%), var(--bg)",
      }}
    >
      {ready ? <BrainField /> : null}
    </div>
  );
}
