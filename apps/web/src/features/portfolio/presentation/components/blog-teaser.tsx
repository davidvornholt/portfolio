import Link from 'next/link';
import type { PostListEntry } from '@/shared/content/presentation/components/post-list';
import { formatPostDate } from '@/shared/content/services/format-post-date';
export const BlogTeaser = ({
  posts,
}: {
  readonly posts: ReadonlyArray<PostListEntry>;
}) => (
  <section id="blog" className="folio-wrap border-border border-t py-16">
    <div className="mb-8 flex items-baseline justify-between gap-3">
      <h2 className="folio-heading">Recent writing</h2>
      <Link className="ink-link text-primary" href="/posts">
        All articles ↗
      </Link>
    </div>
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((post) => (
        <Link
          className="group border-border border-t pt-4"
          key={post.href}
          href={post.href}
        >
          {post.date !== undefined && (
            <time
              dateTime={post.date}
              className="folio-label mb-3 block text-muted-foreground"
            >
              {formatPostDate(post.date)}
            </time>
          )}
          <h3 className="font-medium font-serif text-2xl tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
        </Link>
      ))}
    </div>
  </section>
);
