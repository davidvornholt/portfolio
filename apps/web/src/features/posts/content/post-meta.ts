import type { ReactNode } from 'react';

export type PostMeta = Readonly<{
  title: string;
  subtitle?: string;
  slug: string;
  /** The day the post was first published. */
  date: string;
  /** The day of the last rewrite, when the text has changed since `date`. */
  updated?: string;
  category: string;
  readTime: string;
  excerpt: string;
}>;

export type Post = Readonly<{
  meta: PostMeta;
  body: () => ReactNode;
}>;
