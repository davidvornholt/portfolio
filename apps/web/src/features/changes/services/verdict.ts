import { DateTime } from 'effect';

export type CheckOutcome = 'passed' | 'failed' | 'neutral';

/**
 * One run of one automated check on a change's final commit. A check that ran
 * several times, for example after a retry, appears once per run under the
 * same `check`.
 */
export type CheckRun = Readonly<{
  check: string;
  label: string;
  startedAt: DateTime.Utc;
  /** Undefined while the run has not finished. */
  finishedAt: DateTime.Utc | undefined;
  outcome: CheckOutcome;
}>;

export type Verdict = 'passed' | 'failed' | 'unchecked';

export type Judgement = Readonly<{
  verdict: Verdict;
  failedChecks: ReadonlyArray<string>;
}>;

const latestRunsAtMerge = (
  mergedAt: DateTime.Utc,
  runs: ReadonlyArray<CheckRun>,
): ReadonlyArray<CheckRun> => {
  const latest = new Map<string, CheckRun>();
  for (const run of runs) {
    const known = latest.get(run.check);
    const hadFinished =
      run.finishedAt !== undefined &&
      DateTime.isLessThanOrEqualTo(run.finishedAt, mergedAt);
    if (
      hadFinished &&
      (known === undefined ||
        DateTime.isGreaterThanOrEqualTo(run.startedAt, known.startedAt))
    ) {
      latest.set(run.check, run);
    }
  }
  return [...latest.values()];
};

/**
 * Judges a change by what was known at the moment it merged: for every check,
 * the latest run that had finished by then. A run that finished later says
 * nothing about the merge. Clean-up jobs, for example, start when a pull
 * request closes, and their failure would otherwise mark a change that merged
 * with every check green.
 */
export const judgeAtMerge = (
  mergedAt: DateTime.Utc,
  runs: ReadonlyArray<CheckRun>,
): Judgement => {
  const latest = latestRunsAtMerge(mergedAt, runs);
  const failedChecks = latest
    .filter((run) => run.outcome === 'failed')
    .map((run) => run.label);
  if (failedChecks.length > 0) {
    return { verdict: 'failed', failedChecks };
  }
  return {
    verdict: latest.some((run) => run.outcome === 'passed')
      ? 'passed'
      : 'unchecked',
    failedChecks: [],
  };
};
