import { easing } from '@portfolio/ui/easing';

import { header as MotionHeader } from 'motion/react-client';
import type { ReactNode } from 'react';
import { BackNavigation } from '@/shared/content/presentation/components/back-navigation';
import {
  PostList,
  type PostListEntry,
} from '@/shared/content/presentation/components/post-list';

type PostsScreenProps = Readonly<{
  posts: ReadonlyArray<PostListEntry>;
}>;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

export const PostsScreen = ({ posts }: PostsScreenProps): ReactNode => (
  <>
    <BackNavigation href="/#blog" label="Back to home" />
    <section className="mx-auto max-w-4xl px-6 pt-12 pb-24">
      <MotionHeader
        {...fadeInUp}
        transition={{ duration: 0.6, ease: easing }}
        className="mb-16 border-border border-b pb-8"
      >
        <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
          David Vornholt
        </p>
        <h1 className="folio-heading">Writing</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
          I write about what I measure, what breaks, and what I change
          afterward.
        </p>
      </MotionHeader>

      <PostList posts={posts} />
    </section>
  </>
);
