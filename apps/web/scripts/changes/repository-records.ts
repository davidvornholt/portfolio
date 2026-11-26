import { type DateTime, Effect, Order } from 'effect';
import { SearchWindowTooLargeError } from '@/features/changes/errors/changes-errors';
import { berlinDay } from '@/features/changes/services/berlin-day';
import type {
  SnapshotAcceptedProject,
  SnapshotSiteRecord,
} from '@/features/changes/services/snapshot';
import { GitHubGraphQL } from './github-graphql';
import {
  allPages,
  countWithin,
  publicChange,
  request,
  searchLimit,
  searchPage,
} from './merged-changes';

// These searches have no date range to split, so more results than one search
// returns end the run. That keeps a record from being built on a part.
const withinOneSearch = Effect.fnUntraced(function* (query: string) {
  const count = yield* countWithin(query);
  if (count > searchLimit) {
    return yield* new SearchWindowTooLargeError({
      from: 'the first change',
      count,
      message: `A search over all time has ${count} results, more than one search returns.`,
    });
  }
  return count;
});

/**
 * What the checks said about every change `login` merged into `repository`,
 * which has to be public.
 */
export const fetchSiteRecord = Effect.fn('fetchSiteRecord')(function* (
  login: string,
  repository: string,
  fetchedAt: DateTime.Utc,
) {
  const github = yield* GitHubGraphQL;
  const query = `is:pr is:merged is:public author:${login} repo:${repository}`;
  yield* withinOneSearch(query);
  const nodes = yield* allPages('the changes merged into this site', (after) =>
    request(
      'search the changes of this site',
      github.publicMergedChanges({ query, after }),
    ).pipe(Effect.map(searchPage)),
  );
  const changes = yield* Effect.forEach(nodes, publicChange);
  const tally = (verdict: (typeof changes)[number]['verdict']): number =>
    changes.filter((change) => change.verdict === verdict).length;
  const record: SnapshotSiteRecord = {
    repository,
    firstMergedOn:
      changes
        .map((change) => berlinDay(change.mergedAt))
        .toSorted((a, b) => a.localeCompare(b))[0] ?? berlinDay(fetchedAt),
    passed: tally('passed'),
    failed: tally('failed'),
    unchecked: tally('unchecked'),
  };
  return record;
});

const byChangesThenName = Order.combine(
  Order.mapInput(
    Order.flip(Order.Number),
    (project: SnapshotAcceptedProject) => project.changes,
  ),
  Order.mapInput(
    Order.String,
    (project: SnapshotAcceptedProject) => project.repository,
  ),
);

/**
 * The public repositories of other owners that merged a change by `login`,
 * with how many each merged, the most first.
 */
export const fetchAcceptedElsewhere = Effect.fn('fetchAcceptedElsewhere')(
  function* (login: string) {
    const github = yield* GitHubGraphQL;
    const query = `is:pr is:merged is:public author:${login} -user:${login}`;
    yield* withinOneSearch(query);
    const nodes = yield* allPages('the changes merged elsewhere', (after) =>
      request(
        'search changes merged elsewhere',
        github.mergedRepositories({ query, after }),
      ).pipe(Effect.map(searchPage)),
    );
    const merged = new Map<string, number>();
    for (const { repository } of nodes) {
      // An organisation that `login` belongs to grants more than `READ`, and
      // its repositories are not someone else's.
      if (repository.viewerPermission === 'READ') {
        merged.set(
          repository.nameWithOwner,
          (merged.get(repository.nameWithOwner) ?? 0) + 1,
        );
      }
    }
    return [...merged]
      .map(
        ([name, changes]): SnapshotAcceptedProject => ({
          repository: name,
          changes,
        }),
      )
      .sort(byChangesThenName);
  },
);
