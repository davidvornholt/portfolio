import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatPostDate } from '@/shared/content/services/format-post-date';

export type PostListEntry = Readonly<{
  title: string;
  excerpt: string;
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
          className="group grid gap-x-14 gap-y-2 py-6 md:grid-cols-13 md:items-baseline md:py-7"
        >
          <strong className="max-w-xl font-bold text-xl leading-snug tracking-tight underline-offset-4 group-hover:underline group-hover:decoration-2 md:col-span-7 md:text-2xl">
            {post.title}
          </strong>
          <span className="text-muted-foreground leading-relaxed md:col-span-4">
            {post.excerpt}
          </span>
          <span className="text-muted-foreground text-sm md:col-span-2 md:text-right">
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
