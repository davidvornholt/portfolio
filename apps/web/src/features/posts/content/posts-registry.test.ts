import { describe, expect, it } from 'bun:test';
import { getPostBySlug, posts } from './posts-registry';

// These slugs are published URLs shared on LinkedIn and X; they must never change.
const publishedSlugs = [
  'building-the-architects-portfolio',
  'solving-the-cold-boot-problem',
  'mastering-oklch-tailwind-v4',
] as const;

describe('posts registry', () => {
  it('keeps every published slug resolvable', () => {
    for (const slug of publishedSlugs) {
      expect(getPostBySlug(slug)).toBeDefined();
    }
  });

  it('returns undefined for an unknown slug', () => {
    expect(getPostBySlug('not-a-published-post')).toBeUndefined();
  });

  it('has unique slugs', () => {
    const slugs = posts.map((post) => post.meta.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('dates parse as valid ISO dates', () => {
    for (const post of posts) {
      expect(Number.isNaN(new Date(post.meta.date).getTime())).toBe(false);
    }
  });
});
