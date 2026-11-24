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
      <article className="pb-20">
        <header className="folio-wrap arrival article-arrival">
          <div className="section-sign">
            <span className="line-symbol key-notes">W</span>
            <span>
              Writing <span aria-hidden="true">/</span> {post.meta.category}
            </span>
          </div>
          <div className="arrival-grid">
            <h1>{post.meta.title}</h1>
            <div className="arrival-meta">
              <p>David Vornholt</p>
              <time dateTime={post.meta.date}>
                {formatPostDate(post.meta.date)}
              </time>
              <p>{post.meta.readTime}</p>
            </div>
          </div>
          {post.meta.subtitle !== undefined && (
            <p className="mt-6 max-w-2xl text-lg">{post.meta.subtitle}</p>
          )}
        </header>
        <div className="mx-auto max-w-4xl px-6">
          <Body />
        </div>
      </article>
    </>
  );
};

export default PostPage;
