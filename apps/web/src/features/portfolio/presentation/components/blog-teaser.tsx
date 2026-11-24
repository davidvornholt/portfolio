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
    <div className="writing-index">
      {posts.map((post) => (
        <Link className="writing-entry group" key={post.href} href={post.href}>
          {post.date !== undefined && (
            <time
              dateTime={post.date}
              className="folio-label block text-muted-foreground"
            >
              {formatPostDate(post.date)}
            </time>
          )}
          <h3 className="font-medium font-serif text-2xl tracking-tight transition-colors group-hover:text-primary md:text-3xl">
            {post.title}
          </h3>
          <p className="text-muted-foreground">{post.excerpt}</p>
        </Link>
      ))}
    </div>
  </section>
);
