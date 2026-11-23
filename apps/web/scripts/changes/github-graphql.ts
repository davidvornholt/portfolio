import { Context, Layer } from 'effect';
import { GraphQLClient, GraphQLProtocol } from 'effect/graphql';
import { FetchHttpClient } from 'effect/http';
import { GitHubAuth } from './github-auth';
import { operations } from './github-operations';

const authenticatedOperations = operations.middleware(GitHubAuth);

export class GitHubGraphQL extends Context.Service<
  GitHubGraphQL,
  GraphQLClient.FromGroup<typeof authenticatedOperations>
>()('portfolio/web/scripts/changes/GitHubGraphQL') {
  static readonly layerTest = GraphQLClient.layerTest(
    GitHubGraphQL,
    authenticatedOperations,
  );

  static readonly layer = Layer.effect(
    GitHubGraphQL,
    GraphQLClient.make(authenticatedOperations),
  ).pipe(
    Layer.provide(GitHubAuth.layer),
    Layer.provide(
      GraphQLProtocol.layerHttp({ url: 'https://api.github.com/graphql' }),
    ),
    Layer.provide(FetchHttpClient.layer),
  );
}
