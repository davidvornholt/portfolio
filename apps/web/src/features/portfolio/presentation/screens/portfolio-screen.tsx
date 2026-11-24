import type { ReactNode } from 'react';
import type { PostListEntry } from '@/shared/content/presentation/components/post-list';
import { About } from '../components/about';
import { Accepted, type AcceptedProject } from '../components/accepted';
import { Contact } from '../components/contact';
import { Hero } from '../components/hero';
import { Journey } from '../components/journey';
import type { ProjectActivity } from '../components/own-projects';
import { Rulebook } from '../components/rulebook';
import { Servers } from '../components/servers';
import { Work, type WorkSummary } from '../components/work';
import { Writing } from '../components/writing';

type PortfolioScreenProps = Readonly<{
  /** The chart of merged changes and the text that explains it. */
  field: ReactNode;
  legend: ReactNode;
  /** What the checks said about every change to this site's repository. */
  record: ReactNode;
  accepted: ReadonlyArray<AcceptedProject>;
  /** What each public repository merged, week by week. */
  activity: ReadonlyArray<ProjectActivity>;
  works: ReadonlyArray<WorkSummary>;
  posts: ReadonlyArray<PostListEntry>;
}>;

export const PortfolioScreen = ({
  field,
  legend,
  record,
  accepted,
  activity,
  works,
  posts,
}: PortfolioScreenProps): ReactNode => (
  <>
    <Hero field={field} legend={legend} />
    <Work works={works} />
    <Journey />
    <Rulebook record={record} />
    <Servers />
    <Accepted projects={accepted} activity={activity} />
    <Writing posts={posts} />
    <About />
    <Contact />
  </>
);
