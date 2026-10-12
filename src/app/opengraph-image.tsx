import fs from "node:fs";
import path from "node:path";

import { ImageResponse } from "next/og";

import { content } from "@/content/content";

// Required by `output: export`: render this once at build time.
export const dynamic = "force-static";

export const alt = content.meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph card rendered from the hero: the same point cloud, projected
 * at the same lateral angle, over the same palette. Reads the baked cloud
 * off disk and emits it as an inline SVG, so the card stays in sync with
 * whatever brain model the site is currently using.
 */

const YAW = -1.48;
const PITCH = -0.2;

function buildPointSvg(): string {
  const file = path.join(
    process.cwd(),
    "public",
    "models",
    "brain-points-mobile.bin",
  );

  let circles = "";

  try {
    const buffer = fs.readFileSync(file);
    const view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength,
    );
    const count = view.getUint32(4, true);
    const shellBase = 8 + count * 6;

    const parts: string[] = [];

    for (let i = 0; i < count; i++) {
      const x0 = view.getInt16(8 + i * 6, true) / 32767;
      const y0 = view.getInt16(8 + i * 6 + 2, true) / 32767;
      const z0 = view.getInt16(8 + i * 6 + 4, true) / 32767;
      const shell = view.getUint8(shellBase + i) / 255;

      // Pitch about X, then yaw about Y — matching the hero's resting pose.
      const y1 = y0 * Math.cos(PITCH) - z0 * Math.sin(PITCH);
      const z1 = y0 * Math.sin(PITCH) + z0 * Math.cos(PITCH);
      const x2 = x0 * Math.cos(YAW) + z1 * Math.sin(YAW);
      const z2 = -x0 * Math.sin(YAW) + z1 * Math.cos(YAW);

      const depth = Math.max(0, Math.min(1, (z2 + 1) / 2));
      const cx = 600 + x2 * 250;
      const cy = 315 - y1 * 250;

      // Near points white, mid violet, far blue.
      const color =
        depth > 0.62 ? "#F5F7FF" : depth > 0.34 ? "#A78BFA" : "#3B82F6";
      const opacity = (0.22 + depth * 0.68) * (0.45 + 0.55 * shell);
      const r = (0.9 + depth * 1.1) * (0.6 + 0.4 * shell);

      parts.push(
        `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(2)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`,
      );
    }

    circles = parts.join("");
  } catch {
    circles = "";
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#070B1F"/><g>${circles}</g></svg>`;
}

export default async function Image() {
  const svg = buildPointSvg();
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#070B1F",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUri}
          width={1200}
          height={630}
          alt=""
          style={{ position: "absolute", top: 0, left: 180 }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(7,11,31,0.97) 0%, rgba(7,11,31,0.92) 45%, rgba(7,11,31,0.2) 78%, rgba(7,11,31,0) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
            width: 760,
          }}
        >
          <div
            style={{
              fontSize: 19,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#A78BFA",
            }}
          >
            {content.brand.name}
          </div>

          <div
            style={{
              marginTop: 26,
              fontSize: 62,
              lineHeight: 1.08,
              fontWeight: 700,
              color: "#F5F7FF",
              letterSpacing: -1.6,
            }}
          >
            {content.hero.headline}
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 25,
              lineHeight: 1.4,
              color: "#8A93B8",
            }}
          >
            Behavioral health marketing and business consulting, built by
            practice and treatment center owners.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
