import { Config, Effect, Layer, Redacted } from 'effect';
import { GraphQLMiddleware } from 'effect/graphql';

/** The token that reads the data. It needs no permission to write anything. */
export const gitHubToken = Config.Redacted('CHANGES_GITHUB_TOKEN');

export class GitHubAuth extends GraphQLMiddleware.Service<GitHubAuth>()(
  'portfolio/web/scripts/changes/GitHubAuth',
) {
  static readonly layer = Layer.effect(
    GitHubAuth,
    Effect.gen(function* () {
      const token = yield* gitHubToken;
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
