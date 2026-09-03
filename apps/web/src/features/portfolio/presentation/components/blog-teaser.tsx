import { easing } from '@portfolio/ui/easing';
import { ArrowRight, PenLine } from 'lucide-react';
import { header as MotionHeader } from 'motion/react-client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  PostList,
  type PostListEntry,
} from '@/shared/content/presentation/components/post-list';

type BlogTeaserProps = Readonly<{
  posts: ReadonlyArray<PostListEntry>;
}>;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

export const BlogTeaser = ({ posts }: BlogTeaserProps): ReactNode => (
  <section id="blog" className="border-border border-t px-6 py-24 md:py-32">
    <div className="mx-auto max-w-6xl">
      <MotionHeader
        {...fadeInUp}
        transition={{ duration: 0.6, ease: easing }}
        className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"
      >
        <div>
          <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
            <PenLine className="mr-1.5 inline-block size-4" />
            Insights
          </p>
          <h2 className="font-semibold font-serif text-4xl text-foreground md:text-5xl">
            Programming blog
          </h2>
        </div>
        <div className="max-w-md">
          <p className="text-muted-foreground text-sm">
            Notes from building products and the systems behind them:
            architecture, measured results, and the occasional failed
            experiment.
          </p>
          <Link
            href="/posts"
            data-umami-event="posts-archive-open"
            className="group mt-4 inline-flex items-center gap-1.5 font-medium text-primary text-sm transition-colors hover:text-primary/80"
          >
            View all posts
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </MotionHeader>

      <PostList posts={posts} />
    </div>
  </section>
);
