import type { ReactNode } from 'react';
import { ChangeField } from '@/features/changes/presentation/components/change-field';
import { ChangeLegend } from '@/features/changes/presentation/components/change-legend';
import { ChangesTable } from '@/features/changes/presentation/components/changes-table';
import { SiteRecord } from '@/features/changes/presentation/components/site-record';
import { fieldModel } from '@/features/changes/services/field-model';
import { snapshot } from '@/features/changes/services/load-snapshot';
import { repositoryActivity } from '@/features/changes/services/repository-activity';
import {
  totalCounts,
  weeklyTable,
} from '@/features/changes/services/weekly-table';
import type { WorkSummary } from '@/features/portfolio/presentation/components/work';
import { PortfolioScreen } from '@/features/portfolio/presentation/screens/portfolio-screen';
import { postsNewestFirst } from '@/features/posts/content/posts-registry';
import { works } from '@/features/works/content/works-registry';
import type { PostListEntry } from '@/shared/content/presentation/components/post-list';

// The legend describes the chart, for sighted visitors and as the chart's
// description for assistive technology.
const legendId = 'changes-legend';

const model = fieldModel(snapshot);

const workSummaries: ReadonlyArray<WorkSummary> = works.map((work) => ({
  slug: work.meta.slug,
  title: work.meta.title,
  subtitle: work.meta.subtitle,
  summary: work.meta.summary,
  role: work.meta.role,
  since: work.meta.since,
  stage: work.meta.stage,
  liveUrl: work.meta.liveUrl,
  image: work.meta.image,
}));

// The home page shows the newest articles, and the archive has all of them.
const homePostCount = 5;

const postSummaries: ReadonlyArray<PostListEntry> = postsNewestFirst
  .slice(0, homePostCount)
  .map((post) => ({
    title: post.meta.title,
    readTime: post.meta.readTime,
    href: `/posts/${post.meta.slug}`,
    date: post.meta.date,
    picture: post.meta.picture.src,
  }));

const HomePage = (): ReactNode => (
  <PortfolioScreen
    field={<ChangeField model={model} describedBy={legendId} />}
    legend={
      <>
        <ChangeLegend id={legendId} model={model} />
        <ChangesTable
          weeks={weeklyTable(snapshot.days)}
          total={totalCounts(snapshot.days)}
        />
      </>
    }
    record={<SiteRecord record={snapshot.site} />}
    accepted={snapshot.elsewhere}
    activity={repositoryActivity(snapshot.days)}
    works={workSummaries}
    posts={postSummaries}
  />
);

export default HomePage;
