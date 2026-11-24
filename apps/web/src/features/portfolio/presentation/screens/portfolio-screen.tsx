import type { ReactNode } from 'react';
import type { PostListEntry } from '@/shared/content/presentation/components/post-list';
import { Activity } from '../../activity/activity';
import { BlogTeaser } from '../components/blog-teaser';
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
    <HowIWork />
    <div className="folio-wrap py-12 md:py-20">
      <Activity />
    </div>
    <SelectedWorks works={works} />
    <OpenSource />
    <Expertise />
    <BlogTeaser posts={posts} />
  </>
);
