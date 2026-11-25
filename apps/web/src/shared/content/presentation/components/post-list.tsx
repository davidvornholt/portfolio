import type { StaticImageData } from 'next/image';
import Image from 'next/image';
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
  /** The object that stands for the post. The title says what it is about, so the picture needs no words. */
  picture: StaticImageData;
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
          className="group grid grid-cols-[minmax(0,1fr)_4.5rem] gap-x-6 gap-y-2 py-6 lg:grid-cols-[7rem_minmax(0,1fr)_auto] lg:items-baseline lg:gap-x-12 lg:py-7 data-excerpt:lg:grid-cols-[7rem_minmax(0,7fr)_minmax(0,5fr)_auto]"
        >
          <Image
            src={post.picture}
            alt=""
            sizes="7rem"
            className="col-start-2 row-span-3 row-start-1 aspect-[3/2] w-full self-start object-contain mix-blend-multiply lg:col-start-1 lg:row-span-1 lg:self-center"
          />
          <strong className="col-start-1 max-w-4xl font-bold text-xl leading-snug tracking-tight underline decoration-2 decoration-transparent underline-offset-4 group-hover:decoration-current md:text-2xl lg:col-start-auto">
            {post.title}
          </strong>
          {post.excerpt === undefined ? null : (
            <span className="col-start-1 max-w-2xl text-muted-foreground leading-relaxed lg:col-start-auto">
              {post.excerpt}
            </span>
          )}
          <span className="col-start-1 whitespace-nowrap text-muted-foreground text-sm lg:col-start-auto lg:text-right">
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
