import { describe, expect, it } from 'bun:test';
import { Effect, Exit, Layer, Redacted } from 'effect';
import { HttpClient, HttpClientRequest, HttpClientResponse } from 'effect/http';
import { GitHubRest } from './github-rest';
import { checkedTokensAndOwners } from './token-coverage';

const login = 'davidvornholt';
const owners = 'davidvornholt,prosabridge,atrium-schule';
const privateName = 'secret-repository';

type Answer = Readonly<{ status?: number; body: unknown }>;

// What GitHub answers an installation token that asks which repositories it
// reads, with the fields of a private repository the check must not keep.
const installation = (
  owner: string,
  changed: Readonly<Record<string, unknown>> = {},
): Answer => ({
  body: {
    total_count: 12,
    repository_selection: 'all',
    repositories: [
      {
        id: 1,
        name: privateName,
        full_name: `${owner}/${privateName}`,
        private: true,
        owner: { login: owner },
      },
    ],
    ...changed,
  },
});

const wholeOwners: Readonly<Record<string, Answer>> = {
  'token-1': installation('davidvornholt'),
  'token-2': installation('prosabridge'),
  'token-3': installation('atrium-schule'),
};

// Runs the check the way the script does, with a GitHub that answers each
// token as `answers` says. The script gets its tokens and owners from this
// check and from nowhere else, so a failure here ends a run before anything
// is fetched or written.
const check = async (
  tokens: string,
  answers: Readonly<Record<string, Answer>> = wholeOwners,
  ownOwners: string = owners,
) => {
  const requested: Array<string> = [];
  const restFor = (token: Redacted.Redacted) =>
    Layer.succeed(
      GitHubRest,
      HttpClient.make((request, url) => {
        requested.push(`${Redacted.value(token)} ${url.pathname}${url.search}`);
        const answer = answers[Redacted.value(token)] ?? {
          status: 401,
          body: { message: `Bad credentials for ${privateName}` },
        };
        return Effect.succeed(
          HttpClientResponse.fromWeb(
            request,
            Response.json(answer.body, { status: answer.status ?? 200 }),
          ),
        );
      }).pipe(
        HttpClient.mapRequest(
          HttpClientRequest.prependUrl('https://api.github.test'),
        ),
        HttpClient.filterStatusOk,
      ),
    );
  const exit = await Effect.runPromiseExit(
    checkedTokensAndOwners(Redacted.make(tokens), ownOwners, login, restFor),
  );
  return { exit, requested, failure: JSON.stringify(exit) };
};

describe('the tokens and owners a run is given', () => {
  it('accepts one installation token for each owner, each reading all of its owner', async () => {
    const { exit, requested } = await check('token-1, token-2,\ntoken-3');

    expect(Exit.isSuccess(exit) && exit.value.owners).toEqual([
      'davidvornholt',
      'prosabridge',
      'atrium-schule',
    ]);
    expect(
      Exit.isSuccess(exit) && exit.value.tokens.map(Redacted.value),
    ).toEqual(['token-1', 'token-2', 'token-3']);
    expect(requested).toEqual([
      'token-1 /installation/repositories?per_page=1',
      'token-2 /installation/repositories?per_page=1',
      'token-3 /installation/repositories?per_page=1',
    ]);
  });

  it('compares the owner of an installation without regard to case', async () => {
    const { exit } = await check('token-1,token-2,token-3', {
      ...wholeOwners,
      'token-3': installation('Atrium-Schule'),
    });

    expect(Exit.isSuccess(exit)).toBe(true);
  });

  // A personal token has no installation to ask about.
  it('accepts a single token without asking GitHub what it reads', async () => {
    const { exit, requested } = await check('personal-token', {});

    expect(
      Exit.isSuccess(exit) && exit.value.tokens.map(Redacted.value),
    ).toEqual(['personal-token']);
    expect(requested).toEqual([]);
  });

  it('fails on an empty entry instead of dropping it', async () => {
    for (const tokens of ['token-1, ,token-3', 'token-1,token-2,', '']) {
      // biome-ignore lint/performance/noAwaitInLoops: three cases of one check, run one after the other.
      const { failure, requested } = await check(tokens);

      expect(failure).toContain('TokenCoverageError');
      expect(failure).toContain('CHANGES_GITHUB_TOKENS');
      expect(failure).toContain('empty');
      expect(requested).toEqual([]);
    }
  });

  it('fails when the same token is given twice', async () => {
    const { failure, requested } = await check('token-1,token-2,token-1');

    expect(failure).toContain('TokenCoverageError');
    expect(failure).toContain('same token');
    expect(failure).not.toContain('token-1');
    expect(requested).toEqual([]);
  });

  it('fails when there are fewer tokens than owners', async () => {
    const { failure, requested } = await check('token-1,token-2');

    expect(failure).toContain('TokenCoverageError');
    expect(failure).toContain('2 tokens for 3 owners');
    expect(requested).toEqual([]);
  });

  it('fails on an entry with whitespace inside, which commas would separate', async () => {
    const { failure, requested } = await check('token-1 token-2,token-3');

    expect(failure).toContain('TokenCoverageError');
    expect(failure).not.toContain('token-1');
    expect(requested).toEqual([]);
  });

  it('fails when the owners leave out the author or name one twice', async () => {
    const withoutAuthor = await check('token-1', {}, 'prosabridge');
    const twice = await check('token-1', {}, 'davidvornholt,Davidvornholt');

    expect(withoutAuthor.failure).toContain('TokenCoverageError');
    expect(withoutAuthor.failure).toContain('has to name davidvornholt');
    expect(twice.failure).toContain('TokenCoverageError');
    expect(twice.failure).toContain('same owner');
  });
});

describe('what an installation token reads', () => {
  const failing = (answer: Answer) =>
    check('token-1,token-2,token-3', { ...wholeOwners, 'token-2': answer });

  it('fails when the installation reads only selected repositories', async () => {
    const { failure } = await failing(
      installation('prosabridge', { repository_selection: 'selected' }),
    );

    expect(failure).toContain('TokenCoverageError');
    expect(failure).toContain('prosabridge');
    expect(failure).toContain('not all');
    expect(failure).not.toContain(privateName);
  });

  it('fails when the installation is on another owner', async () => {
    const { failure } = await failing(installation('some-other-owner'));

    expect(failure).toContain('TokenCoverageError');
    expect(failure).toContain('prosabridge');
    expect(failure).not.toContain('some-other-owner');
    expect(failure).not.toContain(privateName);
  });

  it('fails when the installation reads no repository', async () => {
    const { failure } = await failing(
      installation('prosabridge', { total_count: 0, repositories: [] }),
    );

    expect(failure).toContain('TokenCoverageError');
    expect(failure).toContain('prosabridge');
    expect(failure).toContain('no repository');
  });

  it('fails without GitHub’s words when the request fails', async () => {
    const { failure } = await failing({
      status: 403,
      body: { message: `Resource not accessible: ${privateName}` },
    });

    expect(failure).toContain('GitHubRequestError');
    expect(failure).toContain('prosabridge');
    expect(failure).toContain('HTTP status 403');
    expect(failure).not.toContain(privateName);
    expect(failure).not.toContain('token-2');
  });

  it('fails without quoting the answer when it cannot be read', async () => {
    const { failure } = await failing({
      body: { repositories: [{ full_name: `prosabridge/${privateName}` }] },
    });

    expect(failure).toContain('GitHubRequestError');
    expect(failure).toContain('prosabridge');
    expect(failure).not.toContain(privateName);
  });

  it('stops at the first token that reads too little', async () => {
    const { requested } = await failing(
      installation('prosabridge', { repository_selection: 'selected' }),
    );

    expect(requested).toHaveLength(2);
  });
});
