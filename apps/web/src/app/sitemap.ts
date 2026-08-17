import type { MetadataRoute } from 'next';

import { siteUrl } from '@/config/site';
import { posts } from '@/features/posts/content/posts-registry';
import { works } from '@/features/works/content/works-registry';

const sitemap = (): MetadataRoute.Sitemap => {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  const workRoutes: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${siteUrl}/works/${work.meta.slug}`,
    lastModified: new Date(work.meta.date),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.meta.slug}`,
    lastModified: new Date(post.meta.date),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes, ...postRoutes];
};

export default sitemap;
