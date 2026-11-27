import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { siteUrl } from '@/config/site';
import { postsNewestFirst } from '@/features/posts/content/posts-registry';
import { PostsScreen } from '@/features/posts/presentation/screens/posts-screen';
import type { PostListEntry } from '@/shared/content/presentation/components/post-list';
import { PageTransition } from '@/shared/page/presentation/components/page-transitions';

const postsDescription =
  'Engineering decisions, measured results, and failed experiments from the products and systems I build.';

export const metadata: Metadata = {
  title: 'Articles',
  description: postsDescription,
  alternates: {
    canonical: `${siteUrl}/posts`,
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/posts`,
    title: 'Articles',
    description: postsDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles',
    description: postsDescription,
  },
};

const postSummaries: ReadonlyArray<PostListEntry> = postsNewestFirst.map(
  (post) => ({
    title: post.meta.title,
    excerpt: post.meta.excerpt,
    readTime: post.meta.readTime,
    slug: post.meta.slug,
    date: post.meta.date,
    picture: post.meta.picture.src,
  }),
);

const PostsPage = (): ReactNode => (
  <PageTransition>
    <PostsScreen posts={postSummaries} />
  </PageTransition>
);

export default PostsPage;
