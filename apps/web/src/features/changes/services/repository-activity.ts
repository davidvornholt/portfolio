import type { SnapshotChange, SnapshotDay } from './snapshot';
import { weeksOf } from './weekly-table';

type Verdict = SnapshotChange['verdict'];

/** The changes one public repository merged during the weeks of the chart. */
export type RepositoryActivity = Readonly<{
  /** The owner and the name, as GitHub writes them. */
  repository: string;
  /**
   * One row per seven days, oldest first. A row holds what the checks said
   * about each change of that week, in the order the changes merged.
   */
  weeks: ReadonlyArray<ReadonlyArray<Verdict>>;
  total: number;
}>;

/**
 * How the changes of the chart spread over the public repositories, week by
 * week. Changes in private repositories carry no name and are left out.
 */
export const repositoryActivity = (
  days: ReadonlyArray<SnapshotDay>,
): ReadonlyArray<RepositoryActivity> => {
  const weeks = weeksOf(days);
  const rows = new Map<string, Array<Array<Verdict>>>();
  for (const [index, week] of weeks.entries()) {
    for (const change of week.flatMap((day) => day.changes)) {
      if (change.source !== null) {
        const row =
          rows.get(change.source.repository) ??
          Array.from({ length: weeks.length }, (): Array<Verdict> => []);
        row[index]?.push(change.verdict);
        rows.set(change.source.repository, row);
      }
    }
  }
  return [...rows.entries()].map(([repository, row]) => ({
    repository,
    weeks: row,
    total: row.reduce((sum, week) => sum + week.length, 0),
  }));
};
