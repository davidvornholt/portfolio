import { describe, expect, it } from 'bun:test';
import {
  getPostBySlug,
  movedPosts,
  posts,
  postsNewestFirst,
} from './posts-registry';

// These slugs are published URLs shared on LinkedIn and X; they must never change.
const publishedSlugs = [
  'executable-engineering-standards',
  'building-the-architects-portfolio',
  'solving-the-cold-boot-problem',
  'mastering-oklch-tailwind-v4',
  'review-loop-ran-for-46-hours',
  'review-fix-versus-coderabbit',
  'cheap-ai-code-reviews',
] as const;

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/u;

describe('posts registry', () => {
  it('keeps every published slug resolvable, as a post or as a redirect to one', () => {
    for (const slug of publishedSlugs) {
      expect(getPostBySlug(movedPosts[slug] ?? slug)).toBeDefined();
    }
  });

  it('redirects no address that still has a post', () => {
    for (const slug of Object.keys(movedPosts)) {
      expect(getPostBySlug(slug)).toBeUndefined();
    }
  });

  it('lists every post once, the newest first', () => {
    const dates = postsNewestFirst.map((post) => post.meta.date);

    expect(postsNewestFirst).toHaveLength(posts.length);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('has unique slugs', () => {
    const slugs = posts.map((post) => post.meta.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('dates are date-only ISO strings', () => {
    for (const post of posts) {
      expect(post.meta.date).toMatch(dateOnlyPattern);
    }
  });

  it('dates parse as valid ISO dates', () => {
    for (const post of posts) {
      expect(Number.isNaN(new Date(post.meta.date).getTime())).toBe(false);
    }
  });
});
