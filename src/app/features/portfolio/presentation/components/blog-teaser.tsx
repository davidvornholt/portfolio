'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, PenLine } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Badge } from '@/shared/ui/presentation/components/badge';

type BlogPost = {
  readonly id: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: string;
  readonly readTime: string;
  readonly href?: string;
};

const blogPosts: readonly BlogPost[] = [
  {
    id: 'clean-code-nextjs',
    title: 'Clean Code in Next.js 16',
    excerpt:
      "Applying Uncle Bob's principles to the modern web. How functional programming patterns enhance maintainability in React Server Components.",
    category: 'Engineering',
    readTime: '8 min read',
  },
  {
    id: 'functional-multilingual',
    title: 'Functional Programming for the Multilingual Mind',
    excerpt:
      'Exploring the parallels between linguistic structure and code architecture. How thinking in multiple languages shapes better abstractions.',
    category: 'Philosophy',
    readTime: '6 min read',
  },
  {
    id: 'digital-experience-architect',
    title: 'The Digital Experience Architect',
    excerpt:
      'Why schools and NGOs need engineering, not just design. Building systems that serve communities with intention and precision.',
    category: 'Case Study',
    readTime: '10 min read',
  },
] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

const BlogPostCard = ({
  post,
  index,
}: {
  readonly post: BlogPost;
  readonly index: number;
}): ReactNode => (
  <motion.article
    {...fadeInUp}
    transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
    className="group flex flex-col border-b border-border pb-8 last:border-b-0 md:flex-row md:items-start md:gap-8"
  >
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
      {post.href ? (
        <Link
          href={post.href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Read Article
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          Coming Soon
        </span>
      )}
    </div>
  </motion.article>
);

export const BlogTeaser = (): ReactNode => (
  <section id="blog" className="px-6 py-24 md:py-32">
    <div className="mx-auto max-w-6xl">
      <motion.header
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
      </motion.header>

      <div className="space-y-8">
        {blogPosts.map((post, index) => (
          <BlogPostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  </section>
);
