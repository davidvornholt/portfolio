import { easing } from '@portfolio/ui/easing';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { article as MotionArticle } from 'motion/react-client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Badge } from '@/shared/ui/presentation/components/badge';

export type PostListEntry = Readonly<{
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  href: string;
  date?: string;
}>;

type PostListProps = Readonly<{
  posts: ReadonlyArray<PostListEntry>;
}>;

const postStaggerSeconds = 0.1;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

const formatPostDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const PostListItem = ({
  post,
  index,
}: Readonly<{
  post: PostListEntry;
  index: number;
}>): ReactNode => (
  <MotionArticle
    {...fadeInUp}
    transition={{
      duration: 0.6,
      ease: easing,
      delay: index * postStaggerSeconds,
    }}
    className="group border-border border-b pb-8 last:border-b-0"
  >
    <Link
      href={post.href}
      data-umami-event="post-open"
      data-umami-event-post={post.title}
      className="flex cursor-pointer flex-col md:flex-row md:items-start md:gap-8"
    >
      <div className="mb-4 flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 md:mb-0 md:w-48">
        <Badge variant="outline" className="text-xs">
          {post.category}
        </Badge>
        <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
          <Clock className="size-3" />
          {post.readTime}
        </span>
        {post.date === undefined ? null : (
          <time
            className="inline-flex w-full items-center gap-1 text-muted-foreground text-xs"
            dateTime={post.date}
          >
            <Calendar className="size-3" />
            {formatPostDate(post.date)}
          </time>
        )}
      </div>

      <div className="flex-1">
        <h3 className="mb-2 font-semibold font-serif text-foreground text-xl transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mb-4 hyphens-auto text-muted-foreground text-sm leading-relaxed">
          {post.excerpt}
        </p>
        <span className="inline-flex items-center gap-1.5 font-medium text-primary text-sm transition-colors group-hover:text-primary/80">
          Read article
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  </MotionArticle>
);

export const PostList = ({ posts }: PostListProps): ReactNode => (
  <div className="space-y-8">
    {posts.map((post, index) => (
      <PostListItem key={post.href} post={post} index={index} />
    ))}
  </div>
);
