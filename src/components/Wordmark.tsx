import { content } from "@/content/content";

/**
 * The Clinician Marketing horizontal lockup.
 *
 * Supplied as artwork on a solid #070B1E background; the background was
 * keyed out to transparency so the mark sits cleanly over the point cloud
 * in the nav, where the header is only partly opaque. The art is
 * light-on-dark, so it is only legible on dark surfaces — use
 * public/brand/wordmark-light.png anywhere the background is light.
 */
export default function Wordmark({
  className = "",
  height = "1.6rem",
}: {
  className?: string;
  /** Rendered height. Width follows the artwork's aspect ratio. */
  height?: string;
}) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/wordmark.webp"
        alt={content.brand.name}
        width={900}
        height={118}
        style={{ height, width: "auto" }}
        className="block"
      />
    </span>
  );
}
