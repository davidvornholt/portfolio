import { Context, Effect, flow, Layer, Schedule } from 'effect';
import { FetchHttpClient, HttpClient, HttpClientRequest } from 'effect/http';
import { gitHubToken } from './github-auth';

const transientRetries = 4;

export class GitHubRest extends Context.Service<
  GitHubRest,
  HttpClient.HttpClient
>()('portfolio/web/scripts/changes/GitHubRest') {
  static readonly layer = Layer.effect(
    GitHubRest,
    Effect.gen(function* () {
      const token = yield* gitHubToken;
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
