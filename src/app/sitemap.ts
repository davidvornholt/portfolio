import { posts, works } from '@velite';
import type { MetadataRoute } from 'next';

import { siteUrl } from '@/config/site';

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
    url: `${siteUrl}/works/${work.slug}`,
    lastModified: new Date(work.date),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes, ...postRoutes];
};

export default sitemap;
