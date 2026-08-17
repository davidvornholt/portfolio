import { buildingTheArchitectsPortfolioPost } from './building-the-architects-portfolio';
import { masteringOklchPost } from './mastering-oklch-tailwind-v4';
import type { Post } from './post-meta';
import { solvingTheColdBootProblemPost } from './solving-the-cold-boot-problem';

export const posts: ReadonlyArray<Post> = [
  buildingTheArchitectsPortfolioPost,
  solvingTheColdBootProblemPost,
  masteringOklchPost,
];

export const getPostBySlug = (slug: string): Post | undefined =>
  posts.find((post) => post.meta.slug === slug);
