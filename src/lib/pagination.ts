import { blogPostsMeta, getBlogPostsForLocale, type BlogPostMeta } from "./blog-posts";

export const POSTS_PER_PAGE = 6;

export function getTotalPages(locale?: string): number {
  const posts = locale ? getBlogPostsForLocale(locale) : blogPostsMeta;
  return Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
}

export function getPostsForPage(page: number, locale?: string): BlogPostMeta[] {
  const posts = locale ? getBlogPostsForLocale(locale) : blogPostsMeta;
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  return posts.slice(start, end);
}

export function isValidPage(page: number, locale?: string): boolean {
  return page >= 1 && page <= getTotalPages(locale);
}
