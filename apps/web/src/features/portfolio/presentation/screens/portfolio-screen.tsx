import type { ReactNode } from 'react';
import type { PostListEntry } from '@/shared/content/presentation/components/post-list';
import { About } from '../components/about';
import { Accepted, type AcceptedProject } from '../components/accepted';
import { Contact } from '../components/contact';
import { Hero } from '../components/hero';
import { Rules } from '../components/rules';
import { Work, type WorkSummary } from '../components/work';
import { Writing } from '../components/writing';

type PortfolioScreenProps = Readonly<{
  /** The chart of merged changes and the text that explains it. */
  field: ReactNode;
  legend: ReactNode;
  /** What the checks said about every change to this site's repository. */
  record: ReactNode;
  accepted: ReadonlyArray<AcceptedProject>;
  works: ReadonlyArray<WorkSummary>;
  posts: ReadonlyArray<PostListEntry>;
}>;

export const PortfolioScreen = ({
  field,
  legend,
  record,
  accepted,
  works,
  posts,
}: PortfolioScreenProps): ReactNode => (
  <>
    <Hero field={field} legend={legend} />
    <Work works={works} />
    <Rules record={record} />
    <Accepted projects={accepted} />
    <Writing posts={posts} />
    <About />
    <Contact />
  </>
);
