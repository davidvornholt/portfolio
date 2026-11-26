import { Effect } from 'effect';
import {
  HttpClientError,
  HttpClientResponse,
  type HttpClientResponse as Response,
} from 'effect/http';
import { GitHubRequestError } from '@/features/changes/errors/changes-errors';
import type { FailedAttempt } from '@/features/changes/services/assemble-snapshot';
import { wasSentBack } from '@/features/changes/services/sent-back';
import { PrivateRunsPage, PublicRunsPage } from './github-operations';
import { GitHubRest } from './github-rest';
import { allPages, type FetchedChange, type ListPage } from './merged-changes';

type Filters = ReadonlyArray<readonly [string, string]>;
type DecodePage<Run> = (
  response: Response.HttpClientResponse,
) => Effect.Effect<
  Readonly<{ total: number; runs: ReadonlyArray<Run> }>,
  unknown
>;

const pageSize = 100;
// GitHub returns at most this many runs for one filtered list.
const listLimit = 1000;
const concurrentRepositories = 3;

const decodePublicPage = HttpClientResponse.schemaBodyJson(PublicRunsPage);
const decodePrivatePage = HttpClientResponse.schemaBodyJson(PrivateRunsPage);

const operation = 'list failed pull request runs';

// Says how reading a page failed, in words that are safe in a public log. The
// error itself is not passed on: its message holds the address of the
// request, which names the repository by its id, and a decoding error can
// quote the response.
const reasonOf = (error: unknown): string => {
  if (!HttpClientError.isHttpClientError(error)) {
    return 'the response did not have the expected shape';
  }
  const status = error.response?.status;
  return `${error.reason._tag}, ${status === undefined ? 'no HTTP status' : `HTTP status ${status}`}`;
};

// `label` is how a message names the repository. The caller passes the name
// of a public repository and nothing that identifies a private one, not even
// its id.
const failedRuns = Effect.fnUntraced(function* <Run extends { id: number }>(
  decodePage: DecodePage<Run>,
  repositoryId: number,
  label: string,
  filters: Filters,
) {
  const client = yield* GitHubRest;
  const failed = (reason: string): GitHubRequestError =>
    new GitHubRequestError({
      operation,
      message: `The request to list the failed pull request runs of ${label} failed: ${reason}.`,
    });
  return yield* allPages(
    `the failed pull request runs of ${label}`,
    (after) => {
      // This list has page numbers where a search has cursors.
      const page = after === null ? 1 : Number(after);
      return client
        .get(`/repositories/${repositoryId}/actions/runs`, {
          urlParams: [
            ...filters,
            ['per_page', String(pageSize)],
            ['page', String(page)],
          ],
        })
        .pipe(
          Effect.flatMap(decodePage),
          Effect.mapError((error) => failed(reasonOf(error))),
          Effect.flatMap(
            (body): Effect.Effect<ListPage<Run>, GitHubRequestError> =>
              body.total >= listLimit
                ? Effect.fail(
                    failed(
                      `it has ${listLimit} or more of them, which is more than GitHub returns`,
                    ),
                  )
                : Effect.succeed({
                    total: body.total,
                    nodes: body.runs,
                    pageInfo: {
                      // Another page follows while the pages so far hold
                      // fewer runs than the list has.
                      hasNextPage: page * pageSize < body.total,
                      endCursor: String(page + 1),
                    },
                  }),
          ),
        );
    },
    (run) => run.id,
  );
});

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
          'a private repository',
          filters,
        );
        return sentBack(runs).map(
          (run): FailedAttempt => ({
            startedAt: run.startedAt,
            source: undefined,
          }),
        );
      }
      const runs = yield* failedRuns(
        decodePublicPage,
        repositoryId,
        repository,
        filters,
      );
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
