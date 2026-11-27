import { Array as Arr, Effect, type Layer, Redacted, Schema } from 'effect';
import { HttpClientResponse } from 'effect/http';
import {
  GitHubRequestError,
  TokenCoverageError,
} from '@/features/changes/errors/changes-errors';
import { GitHubRest, restFailureReason } from './github-rest';

const tokensVariable = 'CHANGES_GITHUB_TOKENS';
const ownersVariable = 'CHANGES_OWNERS';
const whitespace = /\s/u;

// Only what the check needs is decoded, so the name of a private repository
// in the answer is not kept.
const InstallationRepositories = Schema.Struct({
  selection: Schema.String,
  total: Schema.Int,
  repositories: Schema.Array(
    Schema.Struct({ owner: Schema.Struct({ login: Schema.String }) }),
  ),
}).pipe(
  Schema.encodeKeys({
    selection: 'repository_selection',
    total: 'total_count',
  }),
);
const decodeInstallationRepositories = HttpClientResponse.schemaBodyJson(
  InstallationRepositories,
);

const operation = 'read what an installation token reads';

const uncovered = (message: string): TokenCoverageError =>
  new TokenCoverageError({ message });

// The entries of a list that commas separate, without the space around each.
// An empty entry is an error and not dropped: it is a token that was not
// minted or an owner that is missing. The messages give positions, never an
// entry, because an entry can be a token.
const entriesOf = Effect.fnUntraced(function* (
  variable: string,
  value: string,
) {
  const [first = '', ...rest] = value.split(',');
  const entries = Arr.map([first, ...rest], (entry) => entry.trim());
  for (const [index, entry] of entries.entries()) {
    if (entry === '') {
      return yield* uncovered(`Entry ${index + 1} of ${variable} is empty.`);
    }
    if (whitespace.test(entry)) {
      return yield* uncovered(
        `Entry ${index + 1} of ${variable} has whitespace inside. Commas separate the entries.`,
      );
    }
  }
  return entries;
});

const hasRepeat = (entries: ReadonlyArray<string>): boolean =>
  new Set(entries).size < entries.length;

/**
 * Fails unless the token of the surrounding `GitHubRest` is an installation
 * token that reads every repository of `owner`. An installation limited to
 * selected repositories answers every search with complete-looking pages of
 * what it reads, so nothing later in the run would notice what is missing.
 */
const requireAllRepositoriesOf = Effect.fnUntraced(function* (owner: string) {
  const client = yield* GitHubRest;
  const installation = yield* client
    .get('/installation/repositories', { urlParams: [['per_page', '1']] })
    .pipe(
      Effect.flatMap(decodeInstallationRepositories),
      Effect.mapError(
        (error) =>
          new GitHubRequestError({
            operation,
            message: `The request to read what the token for ${owner} reads failed: ${restFailureReason(error)}. When more than one token is given, each has to be an installation token.`,
          }),
      ),
    );
  if (installation.selection !== 'all') {
    return yield* uncovered(
      `The token for ${owner} reads only the repositories selected for its installation, not all of them.`,
    );
  }
  const [repository] = installation.repositories;
  if (installation.total < 1 || repository === undefined) {
    return yield* uncovered(`The token for ${owner} reads no repository.`);
  }
  if (repository.owner.login.toLowerCase() !== owner.toLowerCase()) {
    return yield* uncovered(
      `The token for ${owner} belongs to an installation on another owner.`,
    );
  }
});

/**
 * The tokens and the own owners a run reads with, from the raw values of
 * `CHANGES_GITHUB_TOKENS` and `CHANGES_OWNERS`. Each is a list separated by
 * commas, and `login`, the author, has to be among the owners.
 *
 * One token alone is a personal token for a refresh by hand. It is not
 * checked, because it has no installation to ask about. More than one token
 * means installation tokens: one for each owner, in the same order, and each
 * has to read every repository of its owner. `restFor` gives the REST client
 * that asks GitHub with one token. Any failure ends the run before anything
 * is fetched.
 */
export const checkedTokensAndOwners = Effect.fn('checkedTokensAndOwners')(
  function* (
    rawTokens: Redacted.Redacted,
    rawOwners: string,
    login: string,
    restFor: (token: Redacted.Redacted) => Layer.Layer<GitHubRest>,
  ) {
    const tokenEntries = yield* entriesOf(
      tokensVariable,
      Redacted.value(rawTokens),
    );
    const owners = yield* entriesOf(ownersVariable, rawOwners);
    if (hasRepeat(tokenEntries)) {
      return yield* uncovered(`${tokensVariable} holds the same token twice.`);
    }
    if (hasRepeat(owners.map((owner) => owner.toLowerCase()))) {
      return yield* uncovered(`${ownersVariable} names the same owner twice.`);
    }
    if (!owners.includes(login)) {
      return yield* uncovered(
        `${ownersVariable} has to name ${login} among the own owners.`,
      );
    }
    const tokens = Arr.map(tokenEntries, (token) => Redacted.make(token));
    if (tokens.length > 1) {
      if (tokens.length !== owners.length) {
        return yield* uncovered(
          `${tokensVariable} holds ${tokens.length} tokens for ${owners.length} owners in ${ownersVariable}. More than one token means one installation token for each owner, in the same order.`,
        );
      }
      yield* Effect.forEach(
        Arr.zip(tokens, owners),
        ([token, owner]) =>
          requireAllRepositoriesOf(owner).pipe(Effect.provide(restFor(token))),
        { discard: true },
      );
    }
    return { tokens, owners };
  },
);
