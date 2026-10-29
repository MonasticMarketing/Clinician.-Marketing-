import type { Metadata } from "next";
import Link from "next/link";

import { content } from "@/content/content";
import { psychologyTodayGuide as guide } from "@/content/psychology-today-guide";
import { siteUrl } from "@/lib/site";

const url = `${siteUrl}/${guide.slug}`;

export const metadata: Metadata = {
  // Absolute, so the sitewide "· Clinician Marketing" suffix does not push
  // the rendered title past what Google shows.
  title: { absolute: guide.metaTitle },
  description: guide.metaDescription,
  alternates: { canonical: `/${guide.slug}` },
  openGraph: {
    type: "article",
    url,
    title: guide.metaTitle,
    description: guide.metaDescription,
    publishedTime: guide.published,
    modifiedTime: guide.updated,
  },
  twitter: {
    card: "summary_large_image",
    title: guide.metaTitle,
    description: guide.metaDescription,
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: guide.title,
  description: guide.metaDescription,
  datePublished: guide.published,
  dateModified: guide.updated,
  inLanguage: "en-US",
  mainEntityOfPage: url,
  author: { "@type": "Organization", name: content.brand.name },
  publisher: { "@id": `${siteUrl}/#organization` },
};

export default function PsychologyTodayGuidePage() {
  return (
    <div className="pt-guide relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Hero. No scrim of its own, so the point cloud behind the page
          reads at full strength here, exactly as it does on the home page;
          the article below it dims the brain as it scrolls past. */}
      <section className="pt-hero">
        {/* Scrims: clear at the top on mobile, and only over the left
            column on desktop, so the point cloud stays visible to the
            right of the text exactly as it is on the home page. */}
        <div aria-hidden="true" className="pt-hero-scrim-sm" />
        <div aria-hidden="true" className="pt-hero-scrim-lg" />

        <div className="wrap wrap-wide">
          <div className="pt-hero-col">
          <Link href="/blog" className="pt-back">
            ← All articles
          </Link>
          <div className="eyebrow">{guide.eyebrow}</div>
          <h1>{guide.title}</h1>
          <p className="lede">{guide.lede}</p>
          <div className="meta">
            {guide.meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="cta-row">
            <a
              className="btn"
              href={content.scheduler.embedUrl}
              data-booking
              target="_blank"
              rel="noopener"
            >
              {content.nav.cta.label}, book a 30-minute call
              <span className="sr-only"> about your practice</span>
            </a>
            <a className="btn ghost" href="#checklist">
              Skip to the checklist
            </a>
          </div>
          </div>
        </div>
      </section>

      <div className="pt-body">
        {/* Our own build-time markup — see the note in the content file. */}
        <article
          className="wrap"
          dangerouslySetInnerHTML={{ __html: guide.body }}
        />
      </div>
    </div>
  );
}
