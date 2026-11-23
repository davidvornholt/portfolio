import { Effect, Layer, Redacted } from 'effect';
import { GraphQLMiddleware } from 'effect/graphql';
import { GitHubToken } from './github-token';

export class GitHubAuth extends GraphQLMiddleware.Service<GitHubAuth>()(
  'portfolio/web/scripts/changes/GitHubAuth',
) {
  static readonly layer = Layer.effect(
    GitHubAuth,
    Effect.gen(function* () {
      const token = yield* GitHubToken;
      return GraphQLMiddleware.mapRequest((request) =>
        Effect.succeed({
          ...request,
          headers: {
            ...request.headers,
            authorization: `Bearer ${Redacted.value(token)}`,
          },
        }),
      );
    }),
  );
}
