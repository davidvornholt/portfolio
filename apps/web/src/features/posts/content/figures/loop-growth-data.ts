import points from './loop-growth.json' with { type: 'json' };

/**
 * The size of standards pull request #28 at each of its 70 commits: the
 * minutes since its first commit (July 13, 2026, 18:42 in Germany) and the
 * lines the pull request added at that point. `loop-growth.json` was measured
 * on November 23, 2026 with `git diff --shortstat` against the pull request's
 * base, on the archived branch `museum/review-loop-failed-experiment`.
 */
export const loopGrowth: ReadonlyArray<
  readonly [minutes: number, addedLines: number]
> = points.map(([minutes = 0, addedLines = 0]) => [minutes, addedLines]);

/** What the article says about single points of the run. */
export const loopRun = {
  /** The run was stopped by hand during its 39th round. */
  stoppedAfterHours: 46,
  /** The second commit: the state that was merged later as pull request #32. */
  kept: { afterMinutes: 23, lines: 217 },
  /** The repair of round 17, the largest single commit. */
  largestRepair: { afterMinutes: 1164, lines: 9575 },
  finalLines: 37_451,
} as const;
