import process from 'node:process';
import { DateTime, Effect, Exit, Layer, Schema } from 'effect';
import { SnapshotWriteError } from '@/features/changes/errors/changes-errors';
import { assembleSnapshot } from '@/features/changes/services/assemble-snapshot';
import {
  berlinDay,
  daysEndingOn,
} from '@/features/changes/services/berlin-day';
import { Snapshot } from '@/features/changes/services/snapshot';
import { fetchFailedAttempts } from './failed-attempts';
import { GitHubGraphQL } from './github-graphql';
import { GitHubRest } from './github-rest';
import { fetchMergedChanges } from './merged-changes';
import {
  fetchAcceptedElsewhere,
  fetchSiteRecord,
} from './repository-records';

const login = 'davidvornholt';
const siteRepository = 'davidvornholt/portfolio';
// Thirteen weeks, the widest window the home page shows.
const dayCount = 91;
const snapshotUrl = new URL(
  '../../src/features/changes/data/changes.json',
  import.meta.url,
);

const writeSnapshot = (snapshot: Snapshot) =>
  Effect.tryPromise({
    try: () =>
      globalThis.Bun.write(
        snapshotUrl,
        `${JSON.stringify(Schema.encodeSync(Snapshot)(snapshot))}\n`,
      ),
    catch: (cause) =>
      new SnapshotWriteError({
        path: snapshotUrl.pathname,
        message: `Writing the snapshot failed: ${String(cause)}`,
      }),
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
  const changes = yield* fetchMergedChanges(login, searchDays);
  const attempts = yield* fetchFailedAttempts(
    login,
    searchDays[0] ?? berlinDay(fetchedAt),
    changes,
  );
  const site = yield* fetchSiteRecord(login, siteRepository);
  const elsewhere = yield* fetchAcceptedElsewhere(login);
  const snapshot = assembleSnapshot({
    fetchedAt,
    dayCount,
    changes,
    attempts,
    site,
    elsewhere,
  });
  yield* writeSnapshot(snapshot);
  const shown = snapshot.days.flatMap((day) => day.changes);
  yield* Effect.logInfo(
    `Wrote ${shown.length} changes and ${snapshot.days.flatMap((day) => day.sentBack).length} sent-back attempts for the ${dayCount} days up to ${snapshot.updatedOn}.`,
  );
}).pipe(
  Effect.tapError((error) => Effect.logError(error.message)),
  Effect.provide(Layer.mergeAll(GitHubGraphQL.layer, GitHubRest.layer)),
);

const exit = await Effect.runPromiseExit(fetchChanges);
if (Exit.isFailure(exit)) {
  process.exitCode = 1;
}
