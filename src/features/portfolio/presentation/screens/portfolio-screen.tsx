import type { ReactNode } from 'react';
import { posts } from '#velite';
import { BlogTeaser } from '../components/blog-teaser';
import { CTA } from '../components/cta';
import { Expertise } from '../components/expertise';
import { Hero } from '../components/hero';
import { SelectedWorks } from '../components/selected-works';

const comingSoonPosts = [
  {
    title: 'Functional Programming for the Multilingual Mind',
    excerpt:
      'Exploring the parallels between linguistic structure and code architecture. How thinking in multiple languages shapes better abstractions.',
    category: 'Philosophy',
    readTime: '6 min read',
    comingSoon: true,
  },
  {
    title: 'The Digital Experience Architect',
    excerpt:
      'Why schools and NGOs need engineering, not just design. Building systems that serve communities with intention and precision.',
    category: 'Case Study',
    readTime: '10 min read',
    comingSoon: true,
  },
] as const;

const getBlogPosts = (): readonly {
  readonly title: string;
  readonly excerpt: string;
  readonly category: string;
  readonly readTime: string;
  readonly href?: string;
  readonly comingSoon?: boolean;
}[] => {
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((post) => ({
      title: post.title,
      excerpt: post.excerpt ?? '',
      category: post.category,
      readTime: post.readTime,
      href: `/posts/${post.slug}`,
      comingSoon: false,
    }));

  const placeholdersNeeded = Math.max(0, 3 - latestPosts.length);
  return [...latestPosts, ...comingSoonPosts.slice(0, placeholdersNeeded)];
};

export const PortfolioScreen = (): ReactNode => (
  <>
    <Hero />
    <SelectedWorks />
    <Expertise />
    <BlogTeaser posts={getBlogPosts()} />
    <CTA />
  </>
);
