import { DateTime, Effect, Order } from 'effect';
import {
  IncompleteDataError,
  SearchWindowTooLargeError,
  SiteVerdictMissingError,
} from '@/features/changes/errors/changes-errors';
import { berlinDay } from '@/features/changes/services/berlin-day';
import type {
  SnapshotAcceptedProject,
  SnapshotSiteRecord,
} from '@/features/changes/services/snapshot';
import { GitHubGraphQL } from './github-graphql';
import type { PublicPullRequestNode } from './github-operations';
import {
  allPages,
  countWithin,
  publicChange,
  request,
  searchLimit,
  searchPage,
} from './merged-changes';
import type {
  SiteVerdict,
  SiteVerdicts,
  SiteVerdictsMode,
} from './site-verdicts';

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

// GitHub archives checks after 400 days and deletes them 10 days later. The
// production fetch needs a change older than `recordedWithinDays` to be in
// the committed record, which leaves about 100 days to run the local refresh.
// The refresh doesn't judge a change older than `checksKeptDays`, whose
// checks may be gone, and would record it as unchecked.
const recordedWithinDays = 300;
const checksKeptDays = 400;

const refreshHint =
  'Run the local changes:fetch refresh and commit site-verdicts.json.';
const byHandHint =
  "GitHub may have deleted its checks, so look up each verdict in the pull request's history and add it to site-verdicts.json by hand.";

const unrecordedBefore = (
  nodes: ReadonlyArray<PublicPullRequestNode>,
  known: ReadonlyMap<number, unknown>,
  before: DateTime.Utc,
): ReadonlyArray<number> =>
  nodes
    .filter(
      (node) =>
        !known.has(node.number) && DateTime.isLessThan(node.mergedAt, before),
    )
    .map((node) => node.number)
    .toSorted((a, b) => a - b);

/**
 * What the checks said about every change `login` merged into `repository`,
 * which has to be public, and the verdicts that go into the committed record.
 * A change with a verdict in `recorded` keeps it, so the record doesn't
 * change when GitHub deletes the checks behind it. A change that isn't
 * recorded is judged by its checks, unless it is too old for that: in `read`
 * mode older than `recordedWithinDays`, and in `record` mode older than
 * `checksKeptDays`. Such a change ends the run, and so does a recorded change
 * the search didn't return, which would drop out of the totals.
 */
export const fetchSiteRecord = Effect.fn('fetchSiteRecord')(function* (
  login: string,
  repository: string,
  fetchedAt: DateTime.Utc,
  {
    recorded,
    mode,
  }: Readonly<{ recorded: SiteVerdicts; mode: SiteVerdictsMode }>,
) {
  const github = yield* GitHubGraphQL;
  const query = `is:pr is:merged is:public author:${login} repo:${repository}`;
  yield* withinOneSearch(query);
  const subject = 'the changes merged into this site';
  const nodes = yield* allPages(
    subject,
    (after) =>
      request(
        'search the changes of this site',
        github.publicMergedChanges({ query, after }),
      ).pipe(Effect.map(searchPage)),
    (node) => node.number,
  );
  const fetched = new Set(nodes.map((node) => node.number));
  const absent = recorded.changes
    .map((entry) => entry.number)
    .filter((number) => !fetched.has(number));
  if (absent.length > 0) {
    return yield* new IncompleteDataError({
      subject,
      message: `GitHub did not return all of ${subject}: #${absent.join(', #')} ${absent.length === 1 ? 'is' : 'are'} recorded in site-verdicts.json but missing from the search.`,
    });
  }
  const known = new Map(
    recorded.changes.map((entry) => [entry.number, entry.verdict] as const),
  );
  const days = mode === 'read' ? recordedWithinDays : checksKeptDays;
  const missing = unrecordedBefore(
    nodes,
    known,
    DateTime.subtract(fetchedAt, { days }),
  );
  if (missing.length > 0) {
    return yield* new SiteVerdictMissingError({
      numbers: missing,
      message: `The committed verdicts of this site's changes have no entry for #${missing.join(', #')}, which merged more than ${days} days ago. GitHub deletes the checks of a change about 410 days after they ran, so judging it again could change the site's record. ${mode === 'read' ? refreshHint : byHandHint}`,
    });
  }
  const changes = yield* Effect.forEach(nodes, (node) => {
    const verdict = known.get(node.number);
    return verdict === undefined
      ? Effect.map(
          publicChange(node),
          (change): SiteVerdict => ({
            number: node.number,
            verdict: change.verdict,
          }),
        )
      : Effect.succeed<SiteVerdict>({ number: node.number, verdict });
  });
  const tally = (verdict: SiteVerdict['verdict']): number =>
    changes.filter((change) => change.verdict === verdict).length;
  const record: SnapshotSiteRecord = {
    repository,
    firstMergedOn:
      nodes
        .map((node) => berlinDay(node.mergedAt))
        .toSorted((a, b) => a.localeCompare(b))[0] ?? berlinDay(fetchedAt),
    passed: tally('passed'),
    failed: tally('failed'),
    unchecked: tally('unchecked'),
  };
  const verdicts: SiteVerdicts = {
    changes: changes.toSorted((a, b) => a.number - b.number),
  };
  return { record, verdicts };
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
 * with how many each merged, the most first. `ownOwners` are the accounts and
 * organisations whose repositories are `login`'s own. The search leaves them
 * out, so the answer doesn't depend on whose token asks.
 */
export const fetchAcceptedElsewhere = Effect.fn('fetchAcceptedElsewhere')(
  function* (login: string, ownOwners: ReadonlyArray<string>) {
    const github = yield* GitHubGraphQL;
    const own = ownOwners.map((owner) => `-user:${owner}`).join(' ');
    const query = `is:pr is:merged is:public author:${login} ${own}`;
    yield* withinOneSearch(query);
    const nodes = yield* allPages('the changes merged elsewhere', (after) =>
      request(
        'search changes merged elsewhere',
        github.mergedRepositories({ query, after }),
      ).pipe(Effect.map(searchPage)),
    );
    const merged = new Map<string, number>();
    for (const { repository } of nodes) {
      merged.set(
        repository.nameWithOwner,
        (merged.get(repository.nameWithOwner) ?? 0) + 1,
      );
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
