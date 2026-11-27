import { Context, Effect, flow, Layer, Schedule } from 'effect';
import {
  FetchHttpClient,
  HttpClient,
  HttpClientError,
  HttpClientRequest,
} from 'effect/http';
import { GitHubToken } from './github-token';

const transientRetries = 4;

export class GitHubRest extends Context.Service<
  GitHubRest,
  HttpClient.HttpClient
>()('portfolio/web/scripts/changes/GitHubRest') {
  static readonly layer = Layer.effect(
    GitHubRest,
    Effect.gen(function* () {
      const token = yield* GitHubToken;
      return (yield* HttpClient.HttpClient).pipe(
        HttpClient.mapRequest(
          flow(
            HttpClientRequest.prependUrl('https://api.github.com'),
            HttpClientRequest.acceptJson,
            HttpClientRequest.bearerToken(token),
            HttpClientRequest.setHeader('x-github-api-version', '2022-11-28'),
          ),
        ),
        HttpClient.filterStatusOk,
        HttpClient.retryTransient({
          schedule: Schedule.exponential('1 second'),
          times: transientRetries,
        }),
      );
    }),
  ).pipe(Layer.provide(FetchHttpClient.layer));
}

/**
 * Says how a REST request failed, in words that are safe in a public log. The
 * error itself is not passed on: its message holds the address of the
 * request, which can name a repository by its id, and a decoding error can
 * quote the response.
 */
export const restFailureReason = (error: unknown): string => {
  if (!HttpClientError.isHttpClientError(error)) {
    return 'the response did not have the expected shape';
  }
  const status = error.response?.status;
  return `${error.reason._tag}, ${status === undefined ? 'no HTTP status' : `HTTP status ${status}`}`;
};
