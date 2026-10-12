import { marked } from "marked";

/**
 * Markdown rendering for blog articles.
 *
 * Runs at build time inside a server component, so none of this — and
 * none of `marked` — reaches the browser.
 *
 * On top of plain Markdown it does three things the articles rely on:
 *
 *  1. Gives every h2 and h3 a stable slug id, so the table of contents
 *     and any external deep link resolve.
 *  2. Turns footnote markers written as `[^3]` into superscript links
 *     pointing at the matching numbered item under "References".
 *  3. Gives those reference list items the matching ids.
 *
 * Post-processing the rendered HTML with narrow regexes, rather than
 * overriding marked's renderer, keeps this working across marked's
 * renderer-API changes. The input is our own content, never user input.
 */

export type Heading = { id: string; text: string; level: 2 | 3 };

export type RenderedMarkdown = {
  html: string;
  /** h2s only — enough for a usable contents list. */
  toc: Heading[];
};

/** Strips tags and entities so heading text can be slugged and listed. */
function toPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function renderMarkdown(markdown: string): RenderedMarkdown {
  // Footnote markers -> superscript links. Done before parsing so marked
  // passes the inline HTML through untouched.
  const withFootnotes = markdown.replace(
    /\[\^(\d+)\]/g,
    (_match, n: string) =>
      `<sup class="footnote-ref"><a href="#ref-${n}" aria-label="Reference ${n}">${n}</a></sup>`,
  );

  let html = marked.parse(withFootnotes, { async: false }) as string;

  // Heading ids, de-duplicated in case two headings share a title.
  const toc: Heading[] = [];
  const used = new Map<string, number>();

  html = html.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_match, levelText: string, inner: string) => {
      const level = Number(levelText) as 2 | 3;
      const text = toPlainText(inner);
      const base = slugify(text) || `section-${toc.length + 1}`;
      const seen = used.get(base) ?? 0;
      used.set(base, seen + 1);
      const id = seen === 0 ? base : `${base}-${seen + 1}`;

      if (level === 2) toc.push({ id, text, level });

      return `<h${level} id="${id}">${inner}</h${level}>`;
    },
  );

  // Number the reference list so the footnote links have targets. The
  // references are the final ordered list in the document.
  const lastList = html.lastIndexOf("<ol>");
  if (lastList !== -1) {
    const head = html.slice(0, lastList);
    let index = 0;
    const tail = html
      .slice(lastList)
      .replace(/<li>/g, () => `<li id="ref-${++index}">`);
    html = head + tail;
  }

  return { html, toc };
}
