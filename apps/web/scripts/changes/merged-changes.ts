import { Array as Arr, Effect, Schedule } from 'effect';
import type { GraphQLClient, GraphQLClientError } from 'effect/graphql';
import {
  GitHubRequestError,
  SearchWindowTooLargeError,
} from '@/features/changes/errors/changes-errors';
import type { MergedChange } from '@/features/changes/services/assemble-snapshot';
import { judgeAtMerge } from '@/features/changes/services/verdict';
import { type CheckContext, toCheckRuns } from './check-runs';
import { GitHubGraphQL } from './github-graphql';
import type {
  PrivatePullRequestNode,
  PublicPullRequestNode,
} from './github-operations';

/** A merged change with what links it to its repository's check runs. */
export type FetchedChange = MergedChange &
  Readonly<{ repositoryId: number; headSha: string }>;

type Visibility = 'public' | 'private';
type FinalCommit = NonNullable<
  NonNullable<PrivatePullRequestNode['commits']['nodes']>[number]
>['commit'];

// GitHub returns at most this many results for one search.
export const searchLimit = 1000;
const daysPerSearch = 7;
const concurrentSearches = 3;
const retries = 4;

export const request = <A, R>(
  operation: string,
  effect: Effect.Effect<A, GraphQLClientError.GraphQLClientError, R>,
) =>
  effect.pipe(
    Effect.retry({
      schedule: Schedule.exponential('1 second'),
      while: (error) => error.isRetryable,
      times: retries,
    }),
    Effect.mapError(
      (error) => new GitHubRequestError({ operation, message: error.message }),
    ),
  );

export const allPages = Effect.fnUntraced(function* <Node, E, R>(
  page: (
    after: string | null,
  ) => Effect.Effect<GraphQLClient.NodesConnection<Node | null>, E, R>,
) {
  const nodes: Array<Node> = [];
  let after: string | null = null;
  while (true) {
    const connection: GraphQLClient.NodesConnection<Node | null> =
      yield* page(after);
    nodes.push(...(connection.nodes ?? []).filter((node) => node !== null));
    if (!connection.pageInfo.hasNextPage) {
      return nodes;
    }
    after = connection.pageInfo.endCursor;
  }
});

const checkContexts = Effect.fnUntraced(function* (commit: FinalCommit) {
  const firstPage = commit.statusCheckRollup?.contexts;
  if (firstPage === undefined) {
    return [];
  }
  if (!firstPage.pageInfo.hasNextPage) {
    return (firstPage.nodes ?? []).filter((node) => node !== null);
  }
  const github = yield* GitHubGraphQL;
  return yield* allPages((after) =>
    request(
      'read the checks of a commit',
      github.commitChecks({ commit: commit.id, after }),
    ).pipe(
      Effect.map(
        (result) =>
          result.node?.statusCheckRollup?.contexts ?? {
            pageInfo: { hasNextPage: false, endCursor: null },
            nodes: [],
          },
      ),
    ),
  );
});

const judged = Effect.fnUntraced(function* (node: PrivatePullRequestNode) {
  const commit = node.commits.nodes?.[0]?.commit;
  const contexts: ReadonlyArray<CheckContext> =
    commit === undefined ? [] : yield* checkContexts(commit);
  return {
    mergedAt: node.mergedAt,
    linesChanged: node.additions + node.deletions,
    ...judgeAtMerge(node.mergedAt, toCheckRuns(contexts)),
    repositoryId: node.repository.databaseId,
    headSha: commit?.oid ?? '',
  };
});

export const publicChange = Effect.fnUntraced(function* (node: PublicPullRequestNode) {
  const change: FetchedChange = {
    ...(yield* judged(node)),
    source: {
      repository: node.repository.nameWithOwner,
      number: node.number,
      title: node.title,
      url: node.url,
    },
  };
  return change;
});

const privateChange = Effect.fnUntraced(function* (
  node: PrivatePullRequestNode,
) {
  const change: FetchedChange = { ...(yield* judged(node)), source: undefined };
  return change;
});

const searchQuery = (
  login: string,
  visibility: Visibility,
  days: Arr.NonEmptyReadonlyArray<string>,
): string =>
  `is:pr is:merged is:${visibility} author:${login} merged:${Arr.headNonEmpty(days)}..${Arr.lastNonEmpty(days)}`;

const changesWithin = Effect.fnUntraced(function* (
  query: string,
  visibility: Visibility,
) {
  const github = yield* GitHubGraphQL;
  if (visibility === 'public') {
    const nodes = yield* allPages((after) =>
      request(
        'search public merged changes',
        github.publicMergedChanges({ query, after }),
      ).pipe(Effect.map((result) => result.search)),
    );
    return yield* Effect.forEach(nodes, publicChange);
  }
  const nodes = yield* allPages((after) =>
    request(
      'search private merged changes',
      github.privateMergedChanges({ query, after }),
    ).pipe(Effect.map((result) => result.search)),
  );
  return yield* Effect.forEach(nodes, privateChange);
});

export const countWithin = Effect.fnUntraced(function* (query: string) {
  const github = yield* GitHubGraphQL;
  const result = yield* request(
    'count merged changes',
    github.countMergedChanges({ query }),
  );
  return result.search.issueCount;
});

const changesOfDay = Effect.fnUntraced(function* (
  login: string,
  visibility: Visibility,
  day: string,
) {
  const query = searchQuery(login, visibility, [day]);
  const count = yield* countWithin(query);
  if (count > searchLimit) {
    return yield* new SearchWindowTooLargeError({
      from: day,
      count,
      message: `${count} ${visibility} changes merged on ${day}, more than one search returns.`,
    });
  }
  return yield* changesWithin(query, visibility);
});

const changesOfDays = Effect.fnUntraced(function* (
  login: string,
  visibility: Visibility,
  days: Arr.NonEmptyReadonlyArray<string>,
) {
  const query = searchQuery(login, visibility, days);
  if ((yield* countWithin(query)) <= searchLimit) {
    return yield* changesWithin(query, visibility);
  }
  const perDay = yield* Effect.forEach(days, (day) =>
    changesOfDay(login, visibility, day),
  );
  return perDay.flat();
});

/**
 * Every change `login` authored that merged on one of `days` (UTC calendar
 * days, oldest first), judged by the checks that had finished at the merge.
 */
export const fetchMergedChanges = Effect.fn('fetchMergedChanges')(function* (
  login: string,
  days: ReadonlyArray<string>,
) {
  const searches = Arr.chunksOf(days, daysPerSearch).flatMap((chunk) =>
    (['public', 'private'] as const).map(
      (visibility) => [visibility, chunk] as const,
    ),
  );
  const perSearch = yield* Effect.forEach(
    searches,
    ([visibility, chunk]) => changesOfDays(login, visibility, chunk),
    { concurrency: concurrentSearches },
  );
  return perSearch.flat();
});
