import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatPostDate } from '@/shared/content/services/format-post-date';

export type PostListEntry = Readonly<{
  title: string;
  /** What the post found. Left out where the title has to do alone. */
  excerpt?: string;
  readTime: string;
  href: string;
  date?: string;
}>;

/** Posts as rows: the title, what the post found, and how long it reads. */
export const PostList = ({
  posts,
}: {
  readonly posts: ReadonlyArray<PostListEntry>;
}): ReactNode => (
  <ul className="border-foreground border-t-2">
    {posts.map((post) => (
      <li key={post.href} className="border-border border-b">
        <Link
          href={post.href}
          data-umami-event="post-open"
          data-umami-event-post={post.title}
          data-excerpt={post.excerpt === undefined ? undefined : ''}
          className="group grid gap-x-14 gap-y-2 py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-baseline lg:py-7 data-excerpt:lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)_auto]"
        >
          <strong className="max-w-4xl font-bold text-xl leading-snug tracking-tight underline decoration-2 decoration-transparent underline-offset-4 group-hover:decoration-current md:text-2xl">
            {post.title}
          </strong>
          {post.excerpt === undefined ? null : (
            <span className="max-w-2xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </span>
          )}
          <span className="whitespace-nowrap text-muted-foreground text-sm lg:text-right">
            {post.date === undefined ? null : (
              <time dateTime={post.date} className="block">
                {formatPostDate(post.date)}
              </time>
            )}
            {post.readTime}
          </span>
        </Link>
      </li>
    ))}
  </ul>
);
