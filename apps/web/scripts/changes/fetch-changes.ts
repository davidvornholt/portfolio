import process from 'node:process';
import { Config, DateTime, Effect, Exit, Layer, Redacted } from 'effect';
import { SnapshotWriteError } from '@/features/changes/errors/changes-errors';
import { assembleSnapshot } from '@/features/changes/services/assemble-snapshot';
import {
  berlinDay,
  daysEndingOn,
} from '@/features/changes/services/berlin-day';
import {
  encodeSnapshot,
  type Snapshot,
} from '@/features/changes/services/snapshot';
import { fetchFailedAttempts } from './failed-attempts';
import { GitHubGraphQL } from './github-graphql';
import { GitHubRest } from './github-rest';
import { GitHubToken } from './github-token';
import { logFailure } from './log-failure';
import {
  type FetchedChange,
  fetchMergedChanges,
  type Visibility,
} from './merged-changes';
import { fetchAcceptedElsewhere, fetchSiteRecord } from './repository-records';

const login = 'davidvornholt';
const siteRepository = 'davidvornholt/portfolio';
// Thirteen weeks, the widest window the home page shows.
const dayCount = 91;
const snapshotUrl = new URL(
  '../../src/features/changes/data/changes.json',
  import.meta.url,
);
const tokenSeparator = /[\s,]+/u;

// One or more read-only tokens, separated by commas or whitespace. Public
// data is read with the first. Private data is read once with each, because
// each token sees the private repositories of one owner.
const tokens = Config.Redacted('CHANGES_GITHUB_TOKENS').pipe(
  Config.map((value) =>
    Redacted.value(value)
      .split(tokenSeparator)
      .filter((token) => token !== '')
      .map((token) => Redacted.make(token)),
  ),
);

// The accounts and organisations whose repositories are David's own,
// separated like the tokens. A public repository of any other owner counts
// as someone else's project that accepted a change.
const ownOwners = Config.String('CHANGES_OWNERS').pipe(
  Config.map((value) =>
    value.split(tokenSeparator).filter((owner) => owner !== ''),
  ),
);

const gitHub = (token: Redacted.Redacted) =>
  Layer.mergeAll(GitHubGraphQL.layer, GitHubRest.layer).pipe(
    Layer.provide(Layer.succeed(GitHubToken, token)),
  );

const writeSnapshot = (snapshot: Snapshot) =>
  Effect.tryPromise({
    try: () =>
      globalThis.Bun.write(
        snapshotUrl,
        `${JSON.stringify(encodeSnapshot(snapshot))}\n`,
      ),
    catch: (cause) =>
      new SnapshotWriteError({
        path: snapshotUrl.pathname,
        message: `Writing the snapshot failed: ${String(cause)}`,
      }),
  });

const changesAndAttempts = Effect.fnUntraced(function* (
  searchDays: ReadonlyArray<string>,
  visibility: Visibility,
  known: ReadonlySet<number>,
) {
  // Two tokens can reach the same private repository. It counts once.
  const changes = (yield* fetchMergedChanges(
    login,
    searchDays,
    visibility,
  )).filter((change) => !known.has(change.repositoryId));
  const attempts = yield* fetchFailedAttempts(
    login,
    searchDays[0] ?? '',
    changes,
  );
  return { changes, attempts };
});

/**
 * Fetches every change the site shows and writes the snapshot it is built
 * from. Any failure ends the run before the file is written, so a build never
 * starts from partial data.
 */
const fetchChanges = Effect.gen(function* () {
  const fetchedAt = yield* DateTime.now;
  // A German day starts up to two hours before the UTC day of the same date,
  // so the search reaches one UTC day further back than the window.
  const searchDays = daysEndingOn(berlinDay(fetchedAt), dayCount + 1);
  const [firstToken, ...otherTokens] = yield* tokens;
  if (firstToken === undefined) {
    return yield* Effect.fail(
      new Error('CHANGES_GITHUB_TOKENS holds no token.'),
    );
  }
  const owners = yield* ownOwners;
  if (!owners.includes(login)) {
    return yield* Effect.fail(
      new Error(`CHANGES_OWNERS has to name ${login} among the own owners.`),
    );
  }

  const open = yield* Effect.gen(function* () {
    const visible = yield* changesAndAttempts(searchDays, 'public', new Set());
    const site = yield* fetchSiteRecord(login, siteRepository, fetchedAt);
    const elsewhere = yield* fetchAcceptedElsewhere(login, owners);
    return { ...visible, site, elsewhere };
  }).pipe(Effect.provide(gitHub(firstToken)));

  const changes: Array<FetchedChange> = [...open.changes];
  const attempts = [...open.attempts];
  const known = new Set<number>();
  yield* Effect.forEach([firstToken, ...otherTokens], (token) =>
    Effect.gen(function* () {
      const hidden = yield* changesAndAttempts(searchDays, 'private', known);
      changes.push(...hidden.changes);
      attempts.push(...hidden.attempts);
      for (const change of hidden.changes) {
        known.add(change.repositoryId);
      }
    }).pipe(Effect.provide(gitHub(token))),
  );

  const snapshot = assembleSnapshot({
    fetchedAt,
    dayCount,
    changes,
    attempts,
    site: open.site,
    elsewhere: open.elsewhere,
  });
  yield* writeSnapshot(snapshot);
  yield* Effect.logInfo(
    `Wrote ${snapshot.days.flatMap((day) => day.changes).length} changes and ${snapshot.days.flatMap((day) => day.sentBack).length} sent-back attempts for the ${dayCount} days up to ${snapshot.updatedOn}.`,
  );
}).pipe(logFailure);

const exit = await Effect.runPromiseExit(fetchChanges);
if (Exit.isFailure(exit)) {
  process.exitCode = 1;
}
