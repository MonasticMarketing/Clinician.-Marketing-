/**
 * Canonical origin for metadata, sitemap and structured data.
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://clinician.marketing"
).replace(/\/$/, "");
