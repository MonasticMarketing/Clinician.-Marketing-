export type Post = {
  slug: string;
  /** Headline shown on the article itself. */
  title: string;
  /**
   * Browser/SERP title. Set absolutely, without the sitewide
   * "· Clinician Marketing" suffix, so it stays under the ~580px that
   * Google renders before truncating.
   */
  metaTitle: string;
  metaDescription: string;
  /** One or two sentences for the blog index and social cards. */
  excerpt: string;
  /** ISO date. */
  published: string;
  updated: string;
  readingMinutes: number;
  /** Markdown. See the note in each post file. */
  body: string;
};
