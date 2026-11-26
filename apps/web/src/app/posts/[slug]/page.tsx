import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { siteUrl } from '@/config/site';
import type { PostMeta } from '@/features/posts/content/post-meta';
import {
  getPostBySlug,
  movedPosts,
  posts,
} from '@/features/posts/content/posts-registry';
import { BackNavigation } from '@/shared/content/presentation/components/back-navigation';
import { ObjectPicture } from '@/shared/content/presentation/components/object-picture';
import { formatPostDate } from '@/shared/content/services/format-post-date';
import { PageTransition } from '@/shared/page/presentation/components/page-transitions';

type PostPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

// The old addresses are known too, so that each one is built as a redirect.
export const generateStaticParams = (): Array<{ slug: string }> => [
  ...posts.map((post) => ({ slug: post.meta.slug })),
  ...Object.keys(movedPosts).map((slug) => ({ slug })),
];

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
  const movedTo = movedPosts.get(slug);
  if (movedTo !== undefined) {
    permanentRedirect(`/posts/${movedTo}`);
  }
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = createArticleJsonLd(post.meta);
  const Body = post.body;

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: correct way of injecting JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BackNavigation href="/posts" label="All articles" />
      <article className="page-column pt-8 pb-24 md:pt-12">
        <header className="grid gap-x-14 gap-y-8 lg:grid-cols-13 lg:items-start">
          <div className="lg:col-span-8">
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
              , {post.meta.readTime}
            </p>
          </div>
          <ObjectPicture
            slug={post.meta.slug}
            picture={post.meta.picture.src}
            alt={post.meta.picture.alt}
            sharpSizes="(min-width: 64rem) 36vw, 100vw"
            className="order-first w-full lg:order-none lg:col-span-5"
          />
        </header>
        <Body />
      </article>
    </PageTransition>
  );
};

export default PostPage;
