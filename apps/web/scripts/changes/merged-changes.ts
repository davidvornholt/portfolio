import { Array as Arr, Effect, Schedule } from 'effect';
import type { GraphQLClientError } from 'effect/graphql';
import {
  GitHubRequestError,
  IncompleteDataError,
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

export type Visibility = 'public' | 'private';
type FinalCommit = NonNullable<
  NonNullable<PrivatePullRequestNode['commits']['nodes']>[number]
>['commit'];

// GitHub returns at most this many results for one search.
export const searchLimit = 1000;
const daysPerSearch = 7;
const concurrentSearches = 3;
const retries = 4;

// Says how a request failed without GitHub's own words. An error from a
// search over private repositories can quote their names and titles, and so
// can a response that does not decode, and the message ends up in a public
// log. `operation` is fixed text, and the rest are facts about the exchange.
const failureMessage = (
  operation: string,
  error: GraphQLClientError.GraphQLClientError,
): string => {
  const status =
    error.status === undefined
      ? 'no HTTP status'
      : `HTTP status ${error.status}`;
  const retried = error.isRetryable
    ? `retried ${retries} times`
    : 'not retryable';
  return `The request to ${operation} failed: ${error.reason._tag}, ${status}, ${retried}.`;
};

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
      (error) =>
        new GitHubRequestError({
          operation,
          message: failureMessage(operation, error),
        }),
    ),
  );

/**
 * One page of a list, with how many entries GitHub says the whole list has.
 * A page that is not the last says where the next one starts.
 */
export type ListPage<Node> = Readonly<{
  total: number;
  pageInfo: Readonly<{ hasNextPage: boolean; endCursor: string | null }>;
  nodes: ReadonlyArray<Node | null> | null;
}>;

// How often a list is read before the run gives up on it.
const readings = 3;

const incomplete = (subject: string, problem: string): IncompleteDataError =>
  new IncompleteDataError({
    subject,
    message: `GitHub did not return all of ${subject}: ${problem}.`,
  });

/**
 * What tells two entries of a list apart, where the entries have such a
 * thing. With it a reading in which one entry arrived twice is not whole: the
 * list moved between two pages, and the entry it pushed out is missing even
 * though the count is right.
 */
type Identity<Node> = (node: Node) => string | number;

// The entries of a list whose pages have all arrived. Fails unless they make
// up the whole list: every page reports the same length, no entry is empty,
// there are as many entries as the list is long, and none arrived twice.
const wholeList = <Node>(
  subject: string,
  pages: Arr.NonEmptyReadonlyArray<ListPage<Node>>,
  identity?: Identity<Node>,
): Effect.Effect<ReadonlyArray<Node>, IncompleteDataError> => {
  const { total } = Arr.headNonEmpty(pages);
  if (pages.some((page) => page.total !== total)) {
    return Effect.fail(
      incomplete(
        subject,
        `its pages report different lengths (${pages.map((page) => page.total).join(', ')})`,
      ),
    );
  }
  const entries = pages.flatMap((page) => page.nodes ?? []);
  const records = entries.filter((entry) => entry !== null);
  if (records.length !== entries.length) {
    return Effect.fail(
      incomplete(
        subject,
        `${entries.length - records.length} of its entries are empty`,
      ),
    );
  }
  if (records.length !== total) {
    return Effect.fail(
      incomplete(
        subject,
        `it has ${total} entries and ${records.length} arrived`,
      ),
    );
  }
  if (
    identity !== undefined &&
    new Set(records.map(identity)).size !== records.length
  ) {
    return Effect.fail(incomplete(subject, 'one of its entries arrived twice'));
  }
  return Effect.succeed(records);
};

// Reads a list once, from its first page to its last.
const oneReading = Effect.fnUntraced(function* <Node, E, R>(
  subject: string,
  page: (
    after: string | null,
  ) => Effect.Effect<ListPage<Node> | undefined, E, R>,
  identity?: Identity<Node>,
) {
  const first = yield* page(null);
  if (first === undefined) {
    return yield* incomplete(subject, 'its first page is missing');
  }
  const pages: Arr.NonEmptyArray<ListPage<Node>> = [first];
  const starts = new Set<string>();
  while (Arr.lastNonEmpty(pages).pageInfo.hasNextPage) {
    const after = Arr.lastNonEmpty(pages).pageInfo.endCursor;
    if (after === null) {
      return yield* incomplete(
        subject,
        'a page does not say where the next one starts',
      );
    }
    if (starts.has(after)) {
      // Following it would read the same pages without end.
      return yield* incomplete(
        subject,
        'a page points back to one that was already read',
      );
    }
    starts.add(after);
    const next: ListPage<Node> | undefined = yield* page(after);
    if (next === undefined) {
      return yield* incomplete(subject, 'a page after the first is missing');
    }
    pages.push(next);
  }
  return yield* wholeList(subject, pages, identity);
});

/**
 * Every entry of a list that is read page by page. `subject` names the list
 * in messages and has to be safe to print in a public log.
 *
 * A list can change between two pages, for example when a change merges, and
 * then a reading has a gap, reports two lengths, or holds an entry twice.
 * Such a reading is thrown away and the list is read again from its first
 * page. Only a whole reading is returned, and the run fails when none of
 * `readings` is whole.
 */
export const allPages = <Node, E, R>(
  subject: string,
  page: (
    after: string | null,
  ) => Effect.Effect<ListPage<Node> | undefined, E, R>,
  identity?: Identity<Node>,
) =>
  Effect.retry(oneReading(subject, page, identity), {
    while: (error) => error instanceof IncompleteDataError,
    times: readings - 1,
  });

/** The page of a search in `result`. */
export const searchPage = <Node>(
  result: Readonly<{
    search: Readonly<{ issueCount: number }> & Omit<ListPage<Node>, 'total'>;
  }>,
): ListPage<Node> => ({
  total: result.search.issueCount,
  pageInfo: result.search.pageInfo,
  nodes: result.search.nodes,
});

const checksOfCommit = 'the checks of a commit';

const checksPage = (
  contexts: NonNullable<FinalCommit['statusCheckRollup']>['contexts'],
): ListPage<CheckContext> => ({
  total: contexts.totalCount,
  pageInfo: contexts.pageInfo,
  nodes: contexts.nodes,
});

const checkContexts = Effect.fnUntraced(function* (commit: FinalCommit) {
  // A commit that no check ran on has no check list, and that is not a gap.
  const firstPage = commit.statusCheckRollup?.contexts;
  if (firstPage === undefined) {
    return [];
  }
  const github = yield* GitHubGraphQL;
  const readByPage = allPages(checksOfCommit, (after) =>
    request(
      'read the checks of a commit',
      github.commitChecks({ commit: commit.id, after }),
    ).pipe(
      Effect.map((result) => {
        // The commit had a check list when the search read it, so a commit
        // or a list that is gone now is a missing page.
        const contexts = result.node?.statusCheckRollup?.contexts;
        return contexts === undefined ? undefined : checksPage(contexts);
      }),
    ),
  );
  if (firstPage.pageInfo.hasNextPage) {
    return yield* readByPage;
  }
  // The search brought the list along in one response. When that response
  // left part of it out, the list is read by itself, which may be whole.
  return yield* wholeList(checksOfCommit, [checksPage(firstPage)]).pipe(
    Effect.catch(() => readByPage),
  );
});

const judged = Effect.fnUntraced(function* (node: PrivatePullRequestNode) {
  const commit = node.commits.nodes?.[0]?.commit;
  if (commit === undefined) {
    // Without its last commit a change would count as unchecked, and a
    // private change that is unchecked is left out of the chart.
    return yield* new IncompleteDataError({
      subject: 'the last commit of a merged change',
      message:
        'GitHub returned a merged change without its last commit, so its checks cannot be read.',
    });
  }
  const contexts: ReadonlyArray<CheckContext> = yield* checkContexts(commit);
  return {
    mergedAt: node.mergedAt,
    linesChanged: node.additions + node.deletions,
    ...judgeAtMerge(node.mergedAt, toCheckRuns(contexts)),
    repositoryId: node.repository.databaseId,
    headSha: commit.oid,
  };
});

export const publicChange = Effect.fnUntraced(function* (
  node: PublicPullRequestNode,
) {
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
    const nodes = yield* allPages(
      'the public merged changes of a search',
      (after) =>
        request(
          'search public merged changes',
          github.publicMergedChanges({ query, after }),
        ).pipe(Effect.map(searchPage)),
    );
    return yield* Effect.forEach(nodes, publicChange);
  }
  const nodes = yield* allPages(
    'the private merged changes of a search',
    (after) =>
      request(
        'search private merged changes',
        github.privateMergedChanges({ query, after }),
      ).pipe(Effect.map(searchPage)),
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
 * Every change `login` authored in repositories of one visibility that merged
 * on one of `days` (UTC calendar days, oldest first), judged by the checks
 * that had finished at the merge.
 */
export const fetchMergedChanges = Effect.fn('fetchMergedChanges')(function* (
  login: string,
  days: ReadonlyArray<string>,
  visibility: Visibility,
) {
  const perSearch = yield* Effect.forEach(
    Arr.chunksOf(days, daysPerSearch),
    (chunk) => changesOfDays(login, visibility, chunk),
    { concurrency: concurrentSearches },
  );
  return perSearch.flat();
});
