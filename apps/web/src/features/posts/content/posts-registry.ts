import { buildingTheArchitectsPortfolioPost } from './building-the-architects-portfolio';
import { executableEngineeringStandardsPost } from './executable-engineering-standards';
import { masteringOklchPost } from './mastering-oklch-tailwind-v4';
import type { Post } from './post-meta';
import { reviewFixVersusCodeRabbitPost } from './review-fix-versus-coderabbit';
import { reviewLoopRanFor46HoursPost } from './review-loop-ran-for-46-hours';
import { solvingTheColdBootProblemPost } from './solving-the-cold-boot-problem';

export const posts: ReadonlyArray<Post> = [
  executableEngineeringStandardsPost,
  reviewLoopRanFor46HoursPost,
  reviewFixVersusCodeRabbitPost,
  buildingTheArchitectsPortfolioPost,
  solvingTheColdBootProblemPost,
  masteringOklchPost,
];

export const featuredPosts: ReadonlyArray<Post> = [
  executableEngineeringStandardsPost,
  reviewLoopRanFor46HoursPost,
  solvingTheColdBootProblemPost,
];

export const getPostBySlug = (slug: string): Post | undefined =>
  posts.find((post) => post.meta.slug === slug);
