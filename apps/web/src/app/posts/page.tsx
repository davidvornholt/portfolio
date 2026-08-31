import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { siteUrl } from '@/config/site';
import { posts } from '@/features/posts/content/posts-registry';
import { PostsScreen } from '@/features/posts/presentation/screens/posts-screen';
import type { PostListEntry } from '@/shared/content/presentation/components/post-list';

const postsDescription =
  'Engineering decisions, measured results, and failed experiments from the products and systems I build.';

export const metadata: Metadata = {
  title: 'Programming blog',
  description: postsDescription,
  alternates: {
    canonical: `${siteUrl}/posts`,
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/posts`,
    title: 'Programming blog',
    description: postsDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Programming blog',
    description: postsDescription,
  },
};

const postSummaries: ReadonlyArray<PostListEntry> = [...posts]
  .sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime(),
  )
  .map((post) => ({
    title: post.meta.title,
    excerpt: post.meta.excerpt,
    category: post.meta.category,
    readTime: post.meta.readTime,
    href: `/posts/${post.meta.slug}`,
    date: post.meta.date,
  }));

const PostsPage = (): ReactNode => <PostsScreen posts={postSummaries} />;

export default PostsPage;
