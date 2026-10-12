/**
 * The Clinician Marketing wordmark: "Clinician" + the M logo standing in
 * for the M of "Marketing" + "arketing".
 *
 * TO SWAP IN THE REAL LOGO: replace public/brand/m-logo.svg with the
 * supplied file, keeping the same path and filename. Nothing else needs
 * to change. The file currently at that path is a PLACEHOLDER — see
 * DECISIONS.md. If the supplied asset is a PNG rather than an SVG, update
 * M_LOGO_SRC below to match.
 */

import { content } from "@/content/content";

const M_LOGO_SRC = "/brand/m-logo.svg";

export default function Wordmark({
  className = "",
  logoClassName = "",
}: {
  className?: string;
  logoClassName?: string;
}) {
  return (
    <span
      className={`inline-flex items-baseline font-semibold tracking-tight ${className}`}
    >
      {/* The full name stays available to assistive tech and to search
          engines as one uninterrupted string. */}
      <span className="sr-only">{content.brand.name}</span>

      <span aria-hidden="true" className="inline-flex items-baseline">
        Clinician{" "}
        {/* The SVG's viewBox is cropped to the glyph, so sizing it to the
            font's cap height and sitting it on the baseline makes it read
            as the M of "Marketing" rather than as a pasted-in icon. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={M_LOGO_SRC}
          alt=""
          width={12}
          height={15}
          className={`inline-block ${logoClassName}`}
          style={{
            // The mark is taller than it is wide, so matching cap height
            // exactly makes it read narrow next to the type. A small
            // overshoot balances it optically.
            height: "0.86em",
            width: "auto",
            marginLeft: "0.01em",
            marginRight: "0.03em",
            verticalAlign: "baseline",
          }}
        />
        arketing
      </span>
    </span>
  );
}
