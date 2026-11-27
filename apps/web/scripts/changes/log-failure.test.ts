import { describe, expect, it } from 'bun:test';
import { DateTime, Effect, Layer, Logger } from 'effect';
import { GraphQLClientError } from 'effect/graphql';
import { HttpClient, HttpClientRequest, HttpClientResponse } from 'effect/http';
import { fetchFailedAttempts } from './failed-attempts';
import { GitHubGraphQL } from './github-graphql';
import { GitHubRest } from './github-rest';
import { logFailure } from './log-failure';
import { type FetchedChange, fetchMergedChanges } from './merged-changes';

type Handlers = Parameters<typeof GitHubGraphQL.layerTest>[0];

// Runs a fetch that has to fail, the way the script runs it, and returns the
// error's message with every line the run logged.
const failure = async <A, E extends Readonly<{ message: string }>>(
  effect: Effect.Effect<A, E>,
): Promise<Readonly<{ message: string; logged: string }>> => {
  const lines: Array<string> = [];
  const logger = Logger.layer([
    Logger.map(Logger.formatJson, (line) => {
      lines.push(line);
    }),
  ]);
  const error = await Effect.runPromise(
    effect.pipe(logFailure, Effect.flip, Effect.provide(logger)),
  );
  return { message: error.message, logged: lines.join('\n') };
};

const searchPrivateChanges = (
  reason: GraphQLClientError.Reason,
): Effect.Effect<ReadonlyArray<FetchedChange>, Readonly<{ message: string }>> =>
  fetchMergedChanges('davidvornholt', ['2026-11-07'], 'private').pipe(
    Effect.provide(
      GitHubGraphQL.layerTest({
        countMergedChanges: () => Effect.succeed({ search: { issueCount: 1 } }),
        privateMergedChanges: () =>
          Effect.fail(
            new GraphQLClientError.GraphQLClientError({
              operation: 'privateMergedChanges',
              reason,
            }),
          ),
      } satisfies Handlers),
    ),
  );

describe('a failed GraphQL request', () => {
  const marker = 'private-owner/secret-repository';

  it('is logged without the message GitHub sent', async () => {
    const { message, logged } = await failure(
      searchPrivateChanges(
        new GraphQLClientError.ResponseError({
          errors: [
            {
              message: `Could not resolve to a Repository with the name '${marker}'.`,
              type: 'NOT_FOUND',
            },
          ],
          status: 200,
        }),
      ),
    );

    expect(message).not.toContain(marker);
    expect(logged).not.toContain(marker);
    expect(logged).toContain('search private merged changes');
    expect(logged).toContain('HTTP status 200');
  });

  it('is logged without the response that could not be read', async () => {
    const { message, logged } = await failure(
      searchPrivateChanges(
        new GraphQLClientError.DecodeError({
          description: `Expected a string, got {"nameWithOwner":"${marker}"}`,
        }),
      ),
    );

    expect(message).not.toContain(marker);
    expect(logged).not.toContain(marker);
    expect(logged).toContain('search private merged changes');
  });
});

describe('a failed REST request for a private repository', () => {
  const privateRepositoryId = 987_654_321;
  const privateChange: FetchedChange = {
    mergedAt: DateTime.makeUnsafe('2026-11-07T17:48:00Z'),
    linesChanged: 40,
    verdict: 'passed',
    failedChecks: [],
    repositoryId: privateRepositoryId,
    headSha: 'head-sha',
    source: undefined,
  };
  // Answers every request with "not found", the way GitHub does when a token
  // loses access to a repository.
  const notFound = Layer.succeed(
    GitHubRest,
    HttpClient.make((request) =>
      Effect.succeed(
        HttpClientResponse.fromWeb(
          request,
          Response.json({ message: 'Not Found' }, { status: 404 }),
        ),
      ),
    ).pipe(
      HttpClient.mapRequest(
        HttpClientRequest.prependUrl('https://api.github.test'),
      ),
      HttpClient.filterStatusOk,
    ),
  );

  it('is logged without the id of the repository', async () => {
    const { message, logged } = await failure(
      fetchFailedAttempts('davidvornholt', '2026-08-24', [privateChange]).pipe(
        Effect.provide(notFound),
      ),
    );

    expect(message).not.toContain(String(privateRepositoryId));
    expect(logged).not.toContain(String(privateRepositoryId));
    expect(logged).toContain(
      'failed pull request runs of a private repository',
    );
    expect(logged).toContain('HTTP status 404');
  });
});
