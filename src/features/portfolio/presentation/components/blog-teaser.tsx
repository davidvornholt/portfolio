import { ArrowRight, Clock, PenLine } from 'lucide-react';
import {
  article as MotionArticle,
  header as MotionHeader,
} from 'motion/react-client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Badge } from '@/shared/ui/presentation/components/badge';

type BlogPost = {
  readonly title: string;
  readonly excerpt: string;
  readonly category: string;
  readonly readTime: string;
  readonly href?: string;
  readonly comingSoon?: boolean;
};

type BlogTeaserProps = {
  readonly posts: readonly BlogPost[];
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

const BlogPostCardContent = ({
  post,
}: {
  readonly post: BlogPost;
}): ReactNode => (
  <>
    <div className="mb-4 flex shrink-0 items-center gap-4 md:mb-0 md:w-48">
      <Badge variant="outline" className="text-xs">
        {post.category}
      </Badge>
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {post.readTime}
      </span>
    </div>

    <div className="flex-1">
      <h3 className="mb-2 font-serif text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
        {post.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>
      {post.href && !post.comingSoon ? (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
          Read Article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          Coming Soon
        </span>
      )}
    </div>
  </>
);

const BlogPostCard = ({
  post,
  index,
}: {
  readonly post: BlogPost;
  readonly index: number;
}): ReactNode => {
  const isClickable = post.href && !post.comingSoon;

  return (
    <MotionArticle
      {...fadeInUp}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
      className="group border-b border-border pb-8 last:border-b-0"
    >
      {isClickable ? (
        <Link
          href={post.href}
          className="flex cursor-pointer flex-col md:flex-row md:items-start md:gap-8"
        >
          <BlogPostCardContent post={post} />
        </Link>
      ) : (
        <div className="flex flex-col md:flex-row md:items-start md:gap-8">
          <BlogPostCardContent post={post} />
        </div>
      )}
    </MotionArticle>
  );
};

export const BlogTeaser = ({ posts }: BlogTeaserProps): ReactNode => (
  <section id="blog" className="px-6 py-24 md:py-32">
    <div className="mx-auto max-w-6xl">
      <MotionHeader
        {...fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-16 flex flex-col justify-between gap-4 md:flex-row md:items-end"
      >
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            <PenLine className="mr-1.5 inline-block h-4 w-4" />
            Insights
          </p>
          <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
            Programming Blog
          </h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          Thoughts on software engineering, functional programming, and building
          meaningful digital experiences.
        </p>
      </MotionHeader>

      <div className="space-y-8">
        {posts.map((post, index) => (
          <BlogPostCard key={post.title} post={post} index={index} />
        ))}
      </div>
    </div>
  </section>
);
