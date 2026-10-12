import { NextResponse } from "next/server";

import { content } from "@/content/content";

/**
 * Contact form endpoint.
 *
 * Sends the enquiry by email via Resend when RESEND_API_KEY is configured.
 * Without it the submission is accepted and logged, so the form stays
 * usable in local development and in a preview deployment that has no
 * mail credentials.
 *
 * Deliberately collects no clinical information — see the note rendered
 * under the form. Do not add fields that could carry PHI without first
 * putting a business associate agreement in place with the mail provider.
 */

export const runtime = "nodejs";

/** Crude per-instance rate limit. Enough to blunt casual form spam. */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS,
  );

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [existing, times] of hits) {
      if (times.every((time) => now - time >= RATE_LIMIT_WINDOW_MS)) {
        hits.delete(existing);
      }
    }
  }

  return recent.length > RATE_LIMIT_MAX;
}

function asString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a real person never fills this in.
  if (asString(body.company, 200)) {
    return NextResponse.json({ ok: true });
  }

  const submission = {
    name: asString(body.name, 120),
    practice: asString(body.practice, 160),
    role: asString(body.role, 80),
    size: asString(body.size, 80),
    email: asString(body.email, 200),
    phone: asString(body.phone, 40),
    message: asString(body.message, 4000),
  };

  if (!submission.name || !submission.email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(submission.email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // No mail transport configured. Accept the submission rather than
    // showing the visitor an error that is really a deployment gap.
    console.warn(
      "[contact] Mail transport not configured; submission not emailed.",
      { practice: submission.practice, role: submission.role },
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  const rows = (
    [
      ["Name", submission.name],
      ["Practice", submission.practice],
      ["Role", submission.role],
      ["Practice size", submission.size],
      ["Email", submission.email],
      ["Phone", submission.phone],
    ] as const
  )
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#667;">${label}</td><td style="padding:4px 0;"><strong>${escapeHtml(value)}</strong></td></tr>`,
    )
    .join("");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: submission.email,
        subject: `New enquiry — ${submission.practice || submission.name}`,
        html: `
          <h2 style="font-family:system-ui,sans-serif;">New enquiry from ${content.brand.name}</h2>
          <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse;">${rows}</table>
          ${
            submission.message
              ? `<p style="font-family:system-ui,sans-serif;font-size:14px;"><strong>Message</strong></p>
                 <p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap;">${escapeHtml(submission.message)}</p>`
              : ""
          }
        `,
      }),
    });

    if (!response.ok) {
      console.error("[contact] Resend rejected the message", response.status);
      return NextResponse.json(
        { error: "Could not send right now." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[contact] Mail transport failed", error);
    return NextResponse.json(
      { error: "Could not send right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}
