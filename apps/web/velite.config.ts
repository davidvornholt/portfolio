import { defineCollection, defineConfig, s } from 'velite';

const maximumTitleLength = 99;
const maximumSubtitleLength = 200;
const maximumExcerptLength = 300;

const works = defineCollection({
  name: 'Work',
  pattern: 'works/**/*.mdx',
  schema: s.object({
    title: s.string().max(maximumTitleLength),
    subtitle: s.string().max(maximumSubtitleLength),
    slug: s.slug('works'),
    date: s.isodate(),
    timeline: s.string(),
    role: s.string(),
    techStack: s.array(s.string()),
    liveUrl: s.string().url().optional(),
    videoUrl: s.string().url().optional(),
    featured: s.boolean().default(false),
    content: s.mdx(),
  }),
});

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.mdx',
  schema: s.object({
    title: s.string().max(maximumTitleLength),
    subtitle: s.string().max(maximumSubtitleLength).optional(),
    slug: s.slug('posts'),
    date: s.isodate(),
    category: s.string(),
    readTime: s.string(),
    excerpt: s.string().max(maximumExcerptLength).optional(),
    featured: s.boolean().default(false),
    content: s.mdx(),
  }),
});

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { works, posts },
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
