import type { ReactNode } from 'react';
import type { PostListEntry } from '@/shared/content/presentation/components/post-list';
import { BlogTeaser } from '../components/blog-teaser';
import { CTA } from '../components/cta';
import { Expertise } from '../components/expertise';
import { Hero } from '../components/hero';
import { HowIWork } from '../components/how-i-work';
import { OpenSource } from '../components/open-source';
import type { WorkSummary } from '../components/selected-works';
import { SelectedWorks } from '../components/selected-works';

type PortfolioScreenProps = Readonly<{
  works: ReadonlyArray<WorkSummary>;
  posts: ReadonlyArray<PostListEntry>;
}>;

export const PortfolioScreen = ({
  works,
  posts,
}: PortfolioScreenProps): ReactNode => (
  <>
    <Hero />
    <SelectedWorks works={works} />
    <HowIWork />
    <Expertise />
    <OpenSource />
    <BlogTeaser posts={posts} />
    <CTA />
  </>
);
