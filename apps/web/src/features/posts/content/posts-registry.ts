import { buildingTheArchitectsPortfolioPost } from './building-the-architects-portfolio';
import { cheapAiCodeReviewsPost } from './cheap-ai-code-reviews';
import { executableEngineeringStandardsPost } from './executable-engineering-standards';
import { masteringOklchPost } from './mastering-oklch-tailwind-v4';
import type { Post } from './post-meta';
import { readingMyChangeRecordPost } from './reading-my-change-record';
import { reviewFixVersusCodeRabbitPost } from './review-fix-versus-coderabbit';
import { reviewLoopRanFor46HoursPost } from './review-loop-ran-for-46-hours';
import { solvingTheColdBootProblemPost } from './solving-the-cold-boot-problem';
export const posts: ReadonlyArray<Post> = [
  readingMyChangeRecordPost,
  cheapAiCodeReviewsPost,
  executableEngineeringStandardsPost,
  reviewLoopRanFor46HoursPost,
  reviewFixVersusCodeRabbitPost,
  buildingTheArchitectsPortfolioPost,
  solvingTheColdBootProblemPost,
  masteringOklchPost,
].sort((a, b) => b.meta.date.localeCompare(a.meta.date));

const homeArticleCount = 3;
export const featuredPosts = posts.slice(0, homeArticleCount);

export const getPostBySlug = (slug: string): Post | undefined =>
  posts.find((post) => post.meta.slug === slug);
