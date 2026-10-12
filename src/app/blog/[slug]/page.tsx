import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { content } from "@/content/content";
import { getPost, posts } from "@/content/posts";
import { renderMarkdown } from "@/lib/markdown";
import { siteUrl } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    // Absolute, so the sitewide "· Clinician Marketing" suffix does not
    // push the rendered title past what Google shows.
    title: { absolute: post.metaTitle },
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.metaTitle,
      description: post.metaDescription,
      publishedTime: post.published,
      modifiedTime: post.updated,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { html, toc } = renderMarkdown(post.body);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.published,
    dateModified: post.updated,
    inLanguage: "en-US",
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    author: { "@type": "Organization", name: content.brand.name },
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  return (
    <div
      className="relative"
      style={{
        background:
          "linear-gradient(to bottom, rgb(7 11 31 / 0.82) 0%, rgb(7 11 31 / 0.95) 14%, rgb(7 11 31 / 0.96) 100%)",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <Link
          href="/blog"
          className="font-mono text-[0.7rem] tracking-[0.16em] text-[var(--glow)] uppercase hover:underline"
        >
          ← All articles
        </Link>

        <article>
          <header>
            <h1 className="mt-8 text-3xl leading-tight font-semibold sm:text-[2.6rem]">
              {post.title}
            </h1>
            <p className="mt-5 font-mono text-[0.72rem] tracking-[0.1em] text-[var(--muted)] uppercase">
              <time dateTime={post.published}>{formatDate(post.published)}</time>
              {" · "}
              {post.readingMinutes} min read
            </p>
          </header>

          {toc.length > 2 ? (
            <nav
              aria-label="On this page"
              className="card-surface mt-10 rounded-2xl p-6"
            >
              <p className="font-mono text-[0.7rem] tracking-[0.18em] text-[var(--muted)] uppercase">
                On this page
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-[var(--muted-strong)] underline-offset-4 hover:text-[var(--white)] hover:underline"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {/* Build-time render of our own Markdown — no user input. */}
          <div
            className="article mt-12"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>

        <aside className="card-surface mt-16 rounded-2xl p-7 sm:p-8">
          <p className="text-lg font-semibold text-[var(--white)]">
            Want this handled by people who have run practices?
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
            We build and run behavioral health marketing for therapists,
            prescribers, group practices and treatment centers.
          </p>
          <a
            href={content.nav.cta.href}
            data-booking
            target="_blank"
            rel="noopener"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--white)] px-6 py-3 text-sm font-semibold text-[#0a0f2b] transition-transform duration-200 hover:scale-[1.02]"
          >
            {content.nav.cta.label}
            <span className="sr-only"> — book a call about your practice</span>
          </a>
        </aside>
      </div>
    </div>
  );
}
