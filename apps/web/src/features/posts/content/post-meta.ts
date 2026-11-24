import type { ReactNode } from 'react';

export type PostMeta = Readonly<{
  title: string;
  subtitle?: string;
  slug: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
}>;

export type Post = Readonly<{
  meta: PostMeta;
  body: () => ReactNode;
}>;
