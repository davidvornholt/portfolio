import { describe, expect, it } from 'bun:test';
import { DateTime } from 'effect';
import { type CheckContext, toCheckRuns } from './check-runs';

const at = (time: string): DateTime.Utc =>
  DateTime.makeUnsafe(`2026-11-07T${time}Z`);

const checkRun = (
  overrides: Partial<Extract<CheckContext, { __typename: 'CheckRun' }>>,
): CheckContext => ({
  __typename: 'CheckRun',
  name: 'check',
  conclusion: 'SUCCESS',
  startedAt: at('17:30:00'),
  completedAt: at('17:40:00'),
  checkSuite: {
    app: { slug: 'github-actions' },
    workflowRun: { workflow: { name: 'Standards' } },
  },
  ...overrides,
});

describe('toCheckRuns', () => {
  it('names a workflow job by its workflow and gives reruns the same check', () => {
    const runs = toCheckRuns([
      checkRun({ conclusion: 'FAILURE' }),
      checkRun({ startedAt: at('17:41:00'), completedAt: at('17:45:00') }),
    ]);

    expect(runs.map((run) => [run.check, run.label, run.outcome])).toEqual([
      ['run:github-actions/Standards/check', 'Standards / check', 'failed'],
      ['run:github-actions/Standards/check', 'Standards / check', 'passed'],
    ]);
  });

  it('keeps jobs with the same name in different workflows apart', () => {
    const runs = toCheckRuns([
      checkRun({}),
      checkRun({
        checkSuite: {
          app: { slug: 'github-actions' },
          workflowRun: { workflow: { name: 'Nix' } },
        },
      }),
    ]);

    expect(new Set(runs.map((run) => run.check)).size).toBe(2);
  });

  it.each([
    ['SUCCESS', 'passed'],
    ['FAILURE', 'failed'],
    ['TIMED_OUT', 'failed'],
    ['STARTUP_FAILURE', 'failed'],
    ['ACTION_REQUIRED', 'failed'],
    ['CANCELLED', 'neutral'],
    ['SKIPPED', 'neutral'],
    ['NEUTRAL', 'neutral'],
    [null, 'neutral'],
  ] as const)('reads the conclusion %p as %s', (conclusion, outcome) => {
    expect(toCheckRuns([checkRun({ conclusion })])[0]?.outcome).toBe(outcome);
  });

  it('leaves a run unfinished while it has no completion time', () => {
    const [run] = toCheckRuns([
      checkRun({ conclusion: null, completedAt: null }),
    ]);

    expect(run?.finishedAt).toBeUndefined();
  });

  it('drops a run that never started', () => {
    expect(
      toCheckRuns([
        checkRun({ conclusion: null, startedAt: null, completedAt: null }),
      ]),
    ).toEqual([]);
  });

  it('labels a check without a workflow by its own name', () => {
    expect(toCheckRuns([checkRun({ checkSuite: null })])[0]).toMatchObject({
      check: 'run://check',
      label: 'check',
    });
  });

  it('treats a commit status as finished when it was created', () => {
    const created = at('17:20:00');

    expect(
      toCheckRuns([
        {
          __typename: 'StatusContext',
          context: 'testing-farm:fedora',
          state: 'ERROR',
          createdAt: created,
        },
        {
          __typename: 'StatusContext',
          context: 'external',
          state: 'PENDING',
          createdAt: created,
        },
      ]),
    ).toEqual([
      {
        check: 'status:testing-farm:fedora',
        label: 'testing-farm:fedora',
        startedAt: created,
        finishedAt: created,
        outcome: 'failed',
      },
      {
        check: 'status:external',
        label: 'external',
        startedAt: created,
        finishedAt: undefined,
        outcome: 'neutral',
      },
    ]);
  });
});
