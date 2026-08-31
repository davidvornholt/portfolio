import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { siteUrl } from '@/config/site';
import type { PostMeta } from '@/features/posts/content/post-meta';
import { getPostBySlug, posts } from '@/features/posts/content/posts-registry';
import { BackNavigation } from '@/shared/content/presentation/components/back-navigation';

type PostPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export const generateStaticParams = (): Array<{ slug: string }> =>
  posts.map((post) => ({ slug: post.meta.slug }));

export const generateMetadata = async ({
  params,
}: PostPageProps): Promise<Metadata | undefined> => {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return;
  }

  const url = `${siteUrl}/posts/${post.meta.slug}`;

  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title: post.meta.title,
      description: post.meta.excerpt,
      publishedTime: post.meta.date,
      authors: ['David Vornholt'],
      section: post.meta.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.excerpt,
    },
  };
};

const createArticleJsonLd = (meta: PostMeta): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: meta.title,
  description: meta.excerpt,
  url: `${siteUrl}/posts/${meta.slug}`,
  datePublished: meta.date,
  author: {
    '@type': 'Person',
    name: 'David Vornholt',
    url: siteUrl,
  },
  articleSection: meta.category,
});

const PostPage = async ({ params }: PostPageProps): Promise<ReactNode> => {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = createArticleJsonLd(post.meta);
  const Body = post.body;

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: correct way of injecting JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BackNavigation href="/posts" label="All posts" />
      <article className="mx-auto max-w-4xl px-6 pt-32 pb-24">
        <header className="mt-12 mb-12 border-border border-b pb-8">
          <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
            {post.meta.category}
          </p>
          <h1 className="mb-4 font-semibold font-serif text-4xl text-foreground md:text-5xl">
            {post.meta.title}
          </h1>
          {post.meta.subtitle === undefined ? null : (
            <p className="mb-4 text-lg text-muted-foreground">
              {post.meta.subtitle}
            </p>
          )}
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <time dateTime={post.meta.date}>
              {new Date(post.meta.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>·</span>
            <span>{post.meta.readTime}</span>
          </div>
        </header>
        <Body />
      </article>
    </>
  );
};

export default PostPage;
