import { post as behavioralHealthMarketingLaws } from "./behavioral-health-marketing-laws";
import type { Post } from "./types";

export type { Post };

/** Newest first. Add new articles here. */
export const posts: Post[] = [behavioralHealthMarketingLaws];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
