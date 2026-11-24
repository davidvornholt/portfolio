import { MDXCodeSnippet } from '@/shared/content/presentation/components/mdx-code-snippet';
import type { Post } from './post-meta';

const workMetaSnippet = `export type WorkMeta = Readonly<{
  title: string;
  subtitle: string;
  slug: string;
  date: string;
  timeline: string;
  role: string;
  techStack: ReadonlyArray<string>;
  liveUrl?: string;
  summary: string;
  outcome: string;
}>;

export type Work = Readonly<{
  meta: WorkMeta;
  body: () => ReactNode;
}>;`;
export const buildingTheArchitectsPortfolioPost: Post = {
  meta: {
    title: 'Why my articles live in the codebase',
    slug: 'building-the-architects-portfolio',
    date: '2026-08-17',
    category: 'Engineering',
    readTime: '2 min read',
    excerpt:
      'I wanted a missing field in a case study to fail before a reader could open the page.',
  },
  body: () => (
    <div className="essay">
      <p>
        A case study appears in several places. The home page needs a short
        description. The project page needs the full story. A link shared in a
        message needs a title and a preview image. I used to have to remember
        which copies to update.
      </p>
      <h2>One entry, several readers</h2>
      <p>
        I keep the metadata beside the article. The home page, the page header,
        and the social image read the same entry. TypeScript checks the fields
        when I build the site.
      </p>
      <MDXCodeSnippet
        language="typescript"
        title="features/works/content/work-meta.ts"
        code={workMetaSnippet}
      />
      <h2>What the type leaves out</h2>
      <p>
        A valid date and a title do not prove that a link still works or that
        the page fits a phone. I keep tests for the addresses I have already
        shared. I open the built pages in a browser and scan them for
        accessibility problems. Those tests follow the path a reader takes after
        the compiler has finished.
      </p>
      <p>
        This arrangement suits a small publication that I maintain myself. I can
        change a sentence, inspect its preview, and publish the same revision I
        reviewed.
      </p>
    </div>
  ),
};
