import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { siteUrl } from '@/config/site';
import type { PostMeta } from '@/features/posts/content/post-meta';
import { getPostBySlug, posts } from '@/features/posts/content/posts-registry';
import { BackNavigation } from '@/shared/content/presentation/components/back-navigation';
import { formatPostDate } from '@/shared/content/services/format-post-date';

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
      modifiedTime: post.meta.updated,
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
  dateModified: meta.updated ?? meta.date,
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
      <BackNavigation href="/posts" label="All articles" />
      <article className="page-column pt-8 pb-24 md:pt-12">
        <header className="max-w-4xl">
          <h1 className="font-bold text-4xl leading-[1.05] tracking-tight md:text-6xl">
            {post.meta.title}
          </h1>
          {post.meta.subtitle === undefined ? null : (
            <p className="mt-4 max-w-2xl font-semibold text-xl leading-snug md:text-2xl">
              {post.meta.subtitle}
            </p>
          )}
          <p className="mt-6 text-muted-foreground">
            <time dateTime={post.meta.date}>
              {formatPostDate(post.meta.date)}
            </time>
            {post.meta.updated === undefined ? null : (
              <>
                , rewritten{' '}
                <time dateTime={post.meta.updated}>
                  {formatPostDate(post.meta.updated)}
                </time>
              </>
            )}
            , {post.meta.readTime}
          </p>
        </header>
        <Body />
      </article>
    </>
  );
};

export default PostPage;
