import type { BlogPostSummary } from '@/features/portfolio/presentation/components/blog-teaser';
import type { WorkSummary } from '@/features/portfolio/presentation/components/selected-works';
import { PortfolioScreen } from '@/features/portfolio/presentation/screens/portfolio-screen';
import { posts } from '@/features/posts/content/posts-registry';
import { works } from '@/features/works/content/works-registry';

const visibleBlogPostCount = 3;

const workSummaries: ReadonlyArray<WorkSummary> = works.map((work) => ({
  slug: work.meta.slug,
  title: work.meta.title,
  role: work.meta.role,
  timeline: work.meta.timeline,
  stack: work.meta.techStack,
  summary: work.meta.summary,
  outcome: work.meta.outcome,
}));

const postSummaries: ReadonlyArray<BlogPostSummary> = [...posts]
  .sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime(),
  )
  .slice(0, visibleBlogPostCount)
  .map((post) => ({
    title: post.meta.title,
    excerpt: post.meta.excerpt,
    category: post.meta.category,
    readTime: post.meta.readTime,
    href: `/posts/${post.meta.slug}`,
  }));

const HomePage = () => (
  <PortfolioScreen works={workSummaries} posts={postSummaries} />
);

export default HomePage;
