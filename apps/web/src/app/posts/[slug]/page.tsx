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
      <article className="pb-24">
        <div className="publication-cover">
          <div className="folio-wrap">
            <BackNavigation href="/posts" label="All posts" />
            <div className="publication-spread">
              <div>
                <p className="folio-label mb-4">
                  Engineering notes / {post.meta.category}
                </p>
                <h1 className="publication-title">{post.meta.title}</h1>
                {post.meta.subtitle !== undefined && (
                  <p className="mt-3 text-lg">{post.meta.subtitle}</p>
                )}
              </div>
              <div aria-hidden="true" className="paragraph-plate">
                ¶
              </div>
            </div>
            <div className="edition-line border-current border-t py-4">
              <span>David Vornholt</span>
              <span>
                <time dateTime={post.meta.date}>
                  {formatPostDate(post.meta.date)}
                </time>{' '}
                · {post.meta.readTime}
              </span>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-6 pt-6">
          <Body />
        </div>
      </article>
    </>
  );
};

export default PostPage;
