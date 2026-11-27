import { DateTime } from 'effect';

/**
 * Whether a failed check run sent a change back for more work. It did unless
 * it ran on the final commit of a change that had already merged when it
 * finished: such a run, for example a clean-up job, rejected nothing.
 */
export const wasSentBack = (
  run: Readonly<{ headSha: string; finishedAt: DateTime.Utc }>,
  mergedAtByHeadSha: ReadonlyMap<string, DateTime.Utc>,
): boolean => {
  const mergedAt = mergedAtByHeadSha.get(run.headSha);
  return (
    mergedAt === undefined ||
    DateTime.isLessThanOrEqualTo(run.finishedAt, mergedAt)
  );
};
