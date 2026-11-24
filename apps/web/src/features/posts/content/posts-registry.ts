import { cheapAiCodeReviewsPost } from './cheap-ai-code-reviews';
import { executableEngineeringStandardsPost } from './executable-engineering-standards';
import { masteringOklchPost } from './mastering-oklch-tailwind-v4';
import type { Post } from './post-meta';
import { reviewFixVersusCodeRabbitPost } from './review-fix-versus-coderabbit';
import { reviewLoopRanFor46HoursPost } from './review-loop-ran-for-46-hours';
import { solvingTheColdBootProblemPost } from './solving-the-cold-boot-problem';
import { thisSiteLookedAiMadePost } from './this-site-looked-ai-made';

// Two posts of one day are listed in this order: the comparison with
// CodeRabbit follows from the review loop, so it counts as the later one.
export const posts: ReadonlyArray<Post> = [
  thisSiteLookedAiMadePost,
  cheapAiCodeReviewsPost,
  executableEngineeringStandardsPost,
  reviewFixVersusCodeRabbitPost,
  reviewLoopRanFor46HoursPost,
  solvingTheColdBootProblemPost,
  masteringOklchPost,
];

/** Every post, the newest first. Dates are ISO days, which sort as text. */
export const postsNewestFirst: ReadonlyArray<Post> = [...posts].sort(
  (one, other) => other.meta.date.localeCompare(one.meta.date),
);

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
