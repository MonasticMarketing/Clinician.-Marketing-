import type { Metadata } from "next";
import Link from "next/link";

import { posts } from "@/content/posts";

export const metadata: Metadata = {
  title: { absolute: "Behavioral Health Marketing Blog | Clinician Marketing" },
  description:
    "Practical guidance on behavioral health marketing, compliance and practice growth, written for clinicians and treatment centers.",
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndexPage() {
  return (
    <div
      className="relative min-h-[70vh]"
      style={{
        background:
          "linear-gradient(to bottom, rgb(7 11 31 / 0.82) 0%, rgb(7 11 31 / 0.95) 16%, rgb(7 11 31 / 0.96) 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <p className="font-mono text-[0.7rem] tracking-[0.2em] text-[var(--glow)] uppercase">
          Blog
        </p>
        <h1 className="mt-4 text-3xl leading-tight font-semibold sm:text-4xl">
          Marketing and compliance, for people who run practices.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted-strong)]">
          Working notes on behavioral health marketing: what the rules
          actually require, what we see go wrong, and what we would do about
          it.
        </p>

        <ul className="mt-14 space-y-5">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="card-surface rounded-2xl p-6 transition-colors duration-200 hover:border-white/25 sm:p-8">
                <p className="font-mono text-[0.7rem] tracking-[0.1em] text-[var(--muted)] uppercase">
                  <time dateTime={post.published}>
                    {formatDate(post.published)}
                  </time>
                  {" · "}
                  {post.readingMinutes} min read
                </p>
                <h2 className="mt-3 text-xl leading-snug font-semibold text-[var(--white)] sm:text-2xl">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {post.excerpt}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
