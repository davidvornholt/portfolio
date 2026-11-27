import { describe, expect, it } from 'bun:test';
import { DateTime, Effect, Exit, Layer } from 'effect';
import { HttpClient, HttpClientRequest, HttpClientResponse } from 'effect/http';
import { fetchFailedAttempts } from './failed-attempts';
import { GitHubRest } from './github-rest';
import type { FetchedChange } from './merged-changes';

const at = (time: string): DateTime.Utc =>
  DateTime.makeUnsafe(`2026-11-07T${time}Z`);

const change = (
  repositoryId: number,
  repository: string | undefined,
): FetchedChange => ({
  mergedAt: at('17:48:00'),
  linesChanged: 40,
  verdict: 'passed',
  failedChecks: [],
  repositoryId,
  headSha: `head-of-${repositoryId}`,
  source:
    repository === undefined
      ? undefined
      : { repository, number: 7, title: 'change 7', url: 'https://example' },
});

let lastRunId = 0;

// A run as GitHub's REST API returns it, with the fields a private
// repository's response also carries. Each one gets an id of its own.
const wireRun = (headSha: string, startedAt: string, updatedAt: string) => ({
  // biome-ignore lint/suspicious/noAssignInExpressions: counting up is the whole point of this fixture.
  id: (lastRunId += 1),
  head_sha: headSha,
  run_started_at: `2026-11-07T${startedAt}Z`,
  updated_at: `2026-11-07T${updatedAt}Z`,
  name: 'Standards',
  display_title: 'fix(sync): keep the lock',
  html_url: 'https://github.com/owner/name/actions/runs/1',
  head_branch: 'fix/keep-the-lock',
  repository: { full_name: 'owner/name' },
});

type WireRun = ReturnType<typeof wireRun>;

// One page of a list as GitHub's REST API returns it. The list is as long as
// the page unless `total` says otherwise.
const wirePage = (
  runs: ReadonlyArray<WireRun>,
  total: number = runs.length,
) => ({ total_count: total, workflow_runs: runs });

const run = (
  pages: (url: URL) => ReturnType<typeof wirePage>,
  changes: ReadonlyArray<FetchedChange>,
) => {
  const requested: Array<URL> = [];
  const rest = Layer.succeed(
    GitHubRest,
    HttpClient.make((request, url) => {
      requested.push(url);
      return Effect.succeed(
        HttpClientResponse.fromWeb(request, Response.json(pages(url))),
      );
    }).pipe(
      HttpClient.mapRequest(
        HttpClientRequest.prependUrl('https://api.github.test'),
      ),
    ),
  );
  return Effect.runPromiseExit(
    fetchFailedAttempts('davidvornholt', '2026-08-24', changes).pipe(
      Effect.provide(rest),
    ),
  ).then((exit) => ({ exit, requested }));
};

describe('fetchFailedAttempts', () => {
  it('asks each repository by id for failed pull request runs of the author', async () => {
    const { requested } = await run(
      () => wirePage([]),
      [
        change(1, 'davidvornholt/standards'),
        change(1, 'davidvornholt/standards'),
        change(2, undefined),
      ],
    );

    expect(requested.map((url) => url.pathname)).toEqual([
      '/repositories/1/actions/runs',
      '/repositories/2/actions/runs',
    ]);
    expect(Object.fromEntries(requested[0]?.searchParams ?? [])).toEqual({
      status: 'failure',
      event: 'pull_request',
      actor: 'davidvornholt',
      created: '>=2026-08-24',
      per_page: '100',
      page: '1',
    });
  });

  it('describes a public attempt and keeps only the start of a private one', async () => {
    const { exit } = await run(
      () => wirePage([wireRun('earlier-commit', '16:00:00', '16:05:00')]),
      [change(1, 'davidvornholt/standards'), change(2, undefined)],
    );

    expect(exit).toEqual(
      Exit.succeed([
        {
          startedAt: at('16:00:00'),
          source: {
            repository: 'davidvornholt/standards',
            workflow: 'Standards',
            title: 'fix(sync): keep the lock',
            url: 'https://github.com/owner/name/actions/runs/1',
          },
        },
        { startedAt: at('16:00:00'), source: undefined },
      ]),
    );
  });

  it('leaves out a run that finished after its change had merged', async () => {
    const { exit } = await run(
      () =>
        wirePage([
          wireRun('head-of-1', '17:48:05', '17:49:00'),
          wireRun('head-of-1', '17:30:00', '17:35:00'),
        ]),
      [change(1, 'davidvornholt/standards')],
    );

    expect(
      Exit.isSuccess(exit) && exit.value.map((attempt) => attempt.startedAt),
    ).toEqual([at('17:30:00')]);
  });

  it('reads every page of a long list', async () => {
    const earlier = (count: number): ReadonlyArray<WireRun> =>
      Array.from({ length: count }, () =>
        wireRun('earlier-commit', '16:00:00', '16:05:00'),
      );
    const fullPage = earlier(100);
    const rest = earlier(3);
    const { exit, requested } = await run(
      (url) =>
        wirePage(url.searchParams.get('page') === '1' ? fullPage : rest, 103),
      [change(2, undefined)],
    );

    expect(Exit.isSuccess(exit) && exit.value).toHaveLength(103);
    expect(requested.map((url) => url.searchParams.get('page'))).toEqual([
      '1',
      '2',
    ]);
  });

  it('fails without quoting the response when a run cannot be read', async () => {
    const { exit } = await run(
      () =>
        wirePage([
          {
            ...wireRun('earlier-commit', '16:00:00', '16:05:00'),
            head_sha: 7,
          },
        ] as never),
      [change(2, undefined)],
    );

    expect(Exit.isFailure(exit)).toBe(true);
    expect(JSON.stringify(exit)).toContain('GitHubRequestError');
    expect(JSON.stringify(exit)).not.toContain('owner/name');
    expect(JSON.stringify(exit)).not.toContain('keep-the-lock');
  });
});

describe('fetchFailedAttempts when GitHub leaves something out', () => {
  const runs = (count: number): ReadonlyArray<WireRun> =>
    Array.from({ length: count }, () =>
      wireRun('earlier-commit', '16:00:00', '16:05:00'),
    );

  it('fails when a list is shorter than the total GitHub reports', async () => {
    const { exit, requested } = await run(
      () => wirePage(runs(3), 5),
      [change(2, undefined)],
    );

    expect(Exit.isFailure(exit)).toBe(true);
    expect(JSON.stringify(exit)).toContain('IncompleteDataError');
    expect(requested).toHaveLength(3);
  });

  it('fails without reading on when a list is longer than GitHub returns', async () => {
    const { exit, requested } = await run(
      () => wirePage(runs(100), 1000),
      [change(2, undefined)],
    );

    expect(Exit.isFailure(exit)).toBe(true);
    expect(JSON.stringify(exit)).toContain('GitHubRequestError');
    expect(requested).toHaveLength(1);
  });

  it('reads a list again when a run fails between two pages', async () => {
    let asked = 0;
    const { exit, requested } = await run(
      (url) => {
        asked += 1;
        const first = url.searchParams.get('page') === '1';
        if (asked > 2) {
          return wirePage(runs(first ? 100 : 2), 102);
        }
        return first ? wirePage(runs(100), 101) : wirePage(runs(1), 102);
      },
      [change(2, undefined)],
    );

    expect(Exit.isSuccess(exit) && exit.value).toHaveLength(102);
    expect(requested.map((url) => url.searchParams.get('page'))).toEqual([
      '1',
      '2',
      '1',
      '2',
    ]);
  });

  // One run left the list and another joined it between the two pages. The
  // count is right, but the last run of the first page arrived again on the
  // second and the run it pushed out is missing.
  it('reads a list again when a run arrives twice', async () => {
    const firstPage = runs(100);
    const repeated = firstPage.slice(-1);
    const whole = runs(1);
    let asked = 0;
    const { exit, requested } = await run(
      (url) => {
        asked += 1;
        if (url.searchParams.get('page') === '1') {
          return wirePage(firstPage, 101);
        }
        return wirePage(asked > 2 ? whole : repeated, 101);
      },
      [change(2, undefined)],
    );

    expect(Exit.isSuccess(exit) && exit.value).toHaveLength(101);
    expect(requested.map((url) => url.searchParams.get('page'))).toEqual([
      '1',
      '2',
      '1',
      '2',
    ]);
  });
});
