import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

export type PostMeta = Readonly<{
  title: string;
  subtitle?: string;
  slug: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  /**
   * A generated black-and-white picture of one object that stands for the
   * article. Its background is pure white, so the object lies on the page.
   */
  picture: Readonly<{ src: StaticImageData; alt: string }>;
}>;

export type Post = Readonly<{
  meta: PostMeta;
  body: () => ReactNode;
}>;
