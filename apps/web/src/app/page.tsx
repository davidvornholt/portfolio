import type { WorkSummary } from '@/features/portfolio/presentation/components/selected-works';
import { PortfolioScreen } from '@/features/portfolio/presentation/screens/portfolio-screen';
import { featuredPosts } from '@/features/posts/content/posts-registry';
import { works } from '@/features/works/content/works-registry';
import type { PostListEntry } from '@/shared/content/presentation/components/post-list';

const workSummaries: ReadonlyArray<WorkSummary> = works.map((work) => ({
  slug: work.meta.slug,
  title: work.meta.title,
  role: work.meta.role,
  summary: work.meta.summary,
}));

const postSummaries: ReadonlyArray<PostListEntry> = featuredPosts.map(
  (post) => ({
    title: post.meta.title,
    date: post.meta.date,
    excerpt: post.meta.excerpt,
    category: post.meta.category,
    readTime: post.meta.readTime,
    href: `/posts/${post.meta.slug}`,
  }),
);

const HomePage = () => (
  <PortfolioScreen works={workSummaries} posts={postSummaries} />
);

export default HomePage;
