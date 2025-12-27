import { posts } from '@velite';
import { notFound } from 'next/navigation';

import { BackNavigation } from '@/shared/content/presentation/components/back-navigation';
import { MDXContent } from '@/shared/content/presentation/components/mdx-content';

type PostPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

type Post = (typeof posts)[number];

const getPostBySlug = (slug: string): Post | undefined =>
  posts.find((post) => post.slug === slug);

export const generateStaticParams = (): Array<{ slug: string }> =>
  posts.map((post) => ({ slug: post.slug }));

export const generateMetadata = async ({
  params,
}: PostPageProps): Promise<
  { title: string; description?: string } | undefined
> => {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return undefined;

  return {
    title: `${post.title} | David Vornholt`,
    description: post.excerpt,
  };
};

const PostPage = async ({
  params,
}: PostPageProps): Promise<React.ReactNode> => {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <BackNavigation href="/#blog" label="Back to Blog" />
      <article className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <header className="mb-12 mt-12 border-b border-border pb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            {post.category}
          </p>
          <h1 className="mb-4 font-serif text-4xl font-semibold text-foreground md:text-5xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </header>
        <MDXContent code={post.content} />
      </article>
    </>
  );
};

export default PostPage;
