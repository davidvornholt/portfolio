import { posts } from '@velite';
import type { ReactNode } from 'react';
import { BlogTeaser } from '../components/blog-teaser';
import { CTA } from '../components/cta';
import { Expertise } from '../components/expertise';
import { Hero } from '../components/hero';
import { SelectedWorks } from '../components/selected-works';

const visibleBlogPostCount = 3;

const getBlogPosts = (): ReadonlyArray<{
  readonly title: string;
  readonly excerpt: string;
  readonly category: string;
  readonly readTime: string;
  readonly href: string;
}> =>
  [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, visibleBlogPostCount)
    .map((post) => ({
      title: post.title,
      excerpt: post.excerpt ?? '',
      category: post.category,
      readTime: post.readTime,
      href: `/posts/${post.slug}`,
    }));

export const PortfolioScreen = (): ReactNode => (
  <>
    <Hero />
    <SelectedWorks />
    <Expertise />
    <BlogTeaser posts={getBlogPosts()} />
    <CTA />
  </>
);
