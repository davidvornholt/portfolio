import { Effect } from 'effect';
import {
  HttpClientResponse,
  type HttpClientResponse as Response,
} from 'effect/http';
import { GitHubRequestError } from '@/features/changes/errors/changes-errors';
import type { FailedAttempt } from '@/features/changes/services/assemble-snapshot';
import { wasSentBack } from '@/features/changes/services/sent-back';
import { PrivateRunsPage, PublicRunsPage } from './github-operations';
import { GitHubRest } from './github-rest';
import type { FetchedChange } from './merged-changes';

type Filters = ReadonlyArray<readonly [string, string]>;
type DecodePage<Run> = (
  response: Response.HttpClientResponse,
) => Effect.Effect<Readonly<{ runs: ReadonlyArray<Run> }>, unknown>;

const pageSize = 100;
// GitHub returns at most this many runs for one filtered list.
const listLimit = 1000;
const concurrentRepositories = 3;

const decodePublicPage = HttpClientResponse.schemaBodyJson(PublicRunsPage);
const decodePrivatePage = HttpClientResponse.schemaBodyJson(PrivateRunsPage);

// The repository is named by its numeric id only, and the cause of a failure
// is not passed on, because a decoding error can quote the response. That
// keeps a private repository's name and titles out of the log.
const failedRuns = Effect.fnUntraced(
  function* <Run>(
    decodePage: DecodePage<Run>,
    repositoryId: number,
    filters: Filters,
  ) {
    const client = yield* GitHubRest;
    const runs: Array<Run> = [];
    for (let page = 1; runs.length < listLimit; page += 1) {
      const response = yield* client.get(
        `/repositories/${repositoryId}/actions/runs`,
        {
          urlParams: [
            ...filters,
            ['per_page', String(pageSize)],
            ['page', String(page)],
          ],
        },
      );
      const next = (yield* decodePage(response)).runs;
      runs.push(...next);
      if (next.length < pageSize) {
        return runs;
      }
    }
    return yield* Effect.fail('The list is longer than GitHub returns.');
  },
  (effect, _decodePage, repositoryId) =>
    Effect.mapError(
      effect,
      () =>
        new GitHubRequestError({
          operation: 'list failed pull request runs',
          message: `Listing the failed pull request runs of repository ${repositoryId} failed, or it has ${listLimit} or more of them.`,
        }),
    ),
);

/**
 * The check runs that failed on `login`'s pull requests since `sinceDay` and
 * sent a change back, in every repository one of `changes` merged into.
 */
export const fetchFailedAttempts = Effect.fn('fetchFailedAttempts')(function* (
  login: string,
  sinceDay: string,
  changes: ReadonlyArray<FetchedChange>,
) {
  const filters: Filters = [
    ['status', 'failure'],
    ['event', 'pull_request'],
    ['actor', login],
    ['created', `>=${sinceDay}`],
  ];
  const mergedAtByHeadSha = new Map(
    changes.map((change) => [change.headSha, change.mergedAt]),
  );
  const sentBack = <
    Run extends { headSha: string; updatedAt: FailedAttempt['startedAt'] },
  >(
    runs: ReadonlyArray<Run>,
  ): ReadonlyArray<Run> =>
    runs.filter((run) =>
      wasSentBack(
        { headSha: run.headSha, finishedAt: run.updatedAt },
        mergedAtByHeadSha,
      ),
    );
  const repositories = new Map(
    changes.map((change) => [change.repositoryId, change.source?.repository]),
  );
  const perRepository = yield* Effect.forEach(
    repositories,
    Effect.fnUntraced(function* ([repositoryId, repository]) {
      if (repository === undefined) {
        const runs = yield* failedRuns(
          decodePrivatePage,
          repositoryId,
          filters,
        );
        return sentBack(runs).map(
          (run): FailedAttempt => ({
            startedAt: run.startedAt,
            source: undefined,
          }),
        );
      }
      const runs = yield* failedRuns(decodePublicPage, repositoryId, filters);
      return sentBack(runs).map(
        (run): FailedAttempt => ({
          startedAt: run.startedAt,
          source: {
            repository,
            workflow: run.workflow ?? 'A workflow',
            title: run.title,
            url: run.url,
          },
        }),
      );
    }),
    { concurrency: concurrentRepositories },
  );
  return perRepository.flat();
});
