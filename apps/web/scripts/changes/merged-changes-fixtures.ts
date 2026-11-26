import { DateTime, Effect } from 'effect';
import { GitHubGraphQL } from './github-graphql';
import type {
  PrivatePullRequestNode,
  PublicPullRequestNode,
} from './github-operations';
import { fetchMergedChanges } from './merged-changes';

export type Handlers = Parameters<typeof GitHubGraphQL.layerTest>[0];
type Commit = NonNullable<
  NonNullable<PrivatePullRequestNode['commits']['nodes']>[number]
>['commit'];
export type Contexts = NonNullable<Commit['statusCheckRollup']>['contexts'];

type PageInfo = Contexts['pageInfo'];

export const mergedAt = DateTime.makeUnsafe('2026-11-07T17:48:00Z');
export const lastPage: PageInfo = { hasNextPage: false, endCursor: null };
export const moreAfter = (endCursor: string): PageInfo => ({
  hasNextPage: true,
  endCursor,
});

export const passedCheck = {
  __typename: 'CheckRun',
  name: 'check',
  conclusion: 'SUCCESS',
  startedAt: DateTime.makeUnsafe('2026-11-07T17:30:00Z'),
  completedAt: DateTime.makeUnsafe('2026-11-07T17:40:00Z'),
  checkSuite: null,
} as const;

// One page of a commit's check list. The list is as long as the page unless
// `totalCount` says otherwise.
export const checks = (
  nodes: NonNullable<Contexts['nodes']>,
  pageInfo: PageInfo = lastPage,
  totalCount: number = nodes.length,
): Contexts => ({ totalCount, pageInfo, nodes });

// One page of a search. The search has as many results as the page unless
// `issueCount` says otherwise.
export const found = <Node>(
  nodes: ReadonlyArray<Node | null>,
  pageInfo: PageInfo = lastPage,
  issueCount: number = nodes.length,
) => ({ search: { issueCount, pageInfo, nodes } });

const commit = (contexts: Contexts): Commit => ({
  id: 'commit-id',
  oid: 'head-sha',
  statusCheckRollup: { contexts },
});

export const privateNode = (
  contexts: Contexts = checks([passedCheck]),
): PrivatePullRequestNode => ({
  mergedAt,
  additions: 30,
  deletions: 10,
  repository: { databaseId: 2 },
  commits: { nodes: [{ commit: commit(contexts) }] },
});

export const publicNode = (number: number): PublicPullRequestNode => ({
  ...privateNode(),
  number,
  title: `change ${number}`,
  url: `https://github.com/davidvornholt/standards/pull/${number}`,
  repository: { databaseId: 1, nameWithOwner: 'davidvornholt/standards' },
});

// Both visibilities, public first, the way the fetch asks for them.
export const run = (handlers: Handlers, days: ReadonlyArray<string>) =>
  Effect.runPromiseExit(
    Effect.all([
      fetchMergedChanges('davidvornholt', days, 'public'),
      fetchMergedChanges('davidvornholt', days, 'private'),
    ]).pipe(
      Effect.map((changes) => changes.flat()),
      Effect.provide(GitHubGraphQL.layerTest(handlers)),
    ),
  );

export const noPublicChanges: Handlers['publicMergedChanges'] = () =>
  Effect.succeed(found([]));
export const noPrivateChanges: Handlers['privateMergedChanges'] = () =>
  Effect.succeed(found([]));
