import type { MetadataRoute } from "next";

import { posts } from "@/content/posts";
import { psychologyTodayGuide } from "@/content/psychology-today-guide";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${siteUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/${psychologyTodayGuide.slug}`,
      lastModified: new Date(`${psychologyTodayGuide.updated}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(`${post.updated}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    {
      url: `${siteUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

// Required by `output: export`: emit this as a static file at build time.
export const dynamic = "force-static";
