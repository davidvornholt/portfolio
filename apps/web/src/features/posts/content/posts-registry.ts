import { cheapAiCodeReviewsPost } from './cheap-ai-code-reviews';
import { executableEngineeringStandardsPost } from './executable-engineering-standards';
import { masteringOklchPost } from './mastering-oklch-tailwind-v4';
import type { Post } from './post-meta';
import { reviewFixVersusCodeRabbitPost } from './review-fix-versus-coderabbit';
import { reviewLoopRanFor46HoursPost } from './review-loop-ran-for-46-hours';
import { solvingTheColdBootProblemPost } from './solving-the-cold-boot-problem';
import { thisSiteLookedAiMadePost } from './this-site-looked-ai-made';

export const posts: ReadonlyArray<Post> = [
  thisSiteLookedAiMadePost,
  cheapAiCodeReviewsPost,
  executableEngineeringStandardsPost,
  reviewLoopRanFor46HoursPost,
  reviewFixVersusCodeRabbitPost,
  solvingTheColdBootProblemPost,
  masteringOklchPost,
];

export const featuredPosts: ReadonlyArray<Post> = [
  reviewFixVersusCodeRabbitPost,
  reviewLoopRanFor46HoursPost,
  cheapAiCodeReviewsPost,
  solvingTheColdBootProblemPost,
];

/**
 * Addresses of articles that were replaced, each with the address of the
 * article that replaced it. They were shared on LinkedIn and X, so they keep
 * working as redirects.
 */
export const movedPosts: Readonly<Record<string, string>> = {
  'building-the-architects-portfolio': 'this-site-looked-ai-made',
};

export const getPostBySlug = (slug: string): Post | undefined =>
  posts.find((post) => post.meta.slug === slug);
