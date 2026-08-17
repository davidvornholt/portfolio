import { describe, expect, it } from 'bun:test';
import { getWorkBySlug, works } from './works-registry';

// fes-kirchheim is a published URL; it must never change.
const publishedSlugs = ['fes-kirchheim', 'atrium', 'prosabridge'] as const;

describe('works registry', () => {
  it('keeps every published slug resolvable', () => {
    for (const slug of publishedSlugs) {
      expect(getWorkBySlug(slug)).toBeDefined();
    }
  });

  it('returns undefined for an unknown slug', () => {
    expect(getWorkBySlug('not-a-published-work')).toBeUndefined();
  });

  it('has unique slugs', () => {
    const slugs = works.map((work) => work.meta.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('dates parse as valid ISO dates', () => {
    for (const work of works) {
      expect(Number.isNaN(new Date(work.meta.date).getTime())).toBe(false);
    }
  });
});
