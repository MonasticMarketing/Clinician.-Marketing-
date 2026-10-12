import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

// Required by `output: export`: emit this as a static file at build time.
export const dynamic = "force-static";
