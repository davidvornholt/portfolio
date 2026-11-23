import type { ReactNode } from 'react';
import { BackNavigation } from '@/shared/content/presentation/components/back-navigation';
import {
  PostList,
  type PostListEntry,
} from '@/shared/content/presentation/components/post-list';

type PostsScreenProps = Readonly<{
  posts: ReadonlyArray<PostListEntry>;
}>;

export const PostsScreen = ({ posts }: PostsScreenProps): ReactNode => (
  <>
    <BackNavigation href="/#writing" label="Home" />
    <section className="page-column pt-8 pb-24 md:pt-12">
      <header className="mb-12">
        <h1 className="font-bold text-4xl leading-[1.05] tracking-tight md:text-6xl">
          Articles
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl md:leading-snug">
          Notes from building products and the systems behind them: decisions,
          measured results, and experiments that failed.
        </p>
      </header>

      <PostList posts={posts} />
    </section>
  </>
);
