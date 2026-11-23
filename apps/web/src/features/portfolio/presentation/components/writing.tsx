import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  PostList,
  type PostListEntry,
} from '@/shared/content/presentation/components/post-list';
import { Section, textLinkClassName } from './section';

export const Writing = ({
  posts,
}: {
  readonly posts: ReadonlyArray<PostListEntry>;
}): ReactNode => (
  <Section id="writing" heading="I measure, then I write it down">
    <div className="mt-10 md:mt-13">
      <PostList posts={posts} />
    </div>
    <p className="mt-7">
      <Link
        href="/posts"
        data-umami-event="posts-archive-open"
        className={textLinkClassName}
      >
        All articles
      </Link>
    </p>
  </Section>
);
