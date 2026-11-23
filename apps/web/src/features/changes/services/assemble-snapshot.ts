import { DateTime, Order } from 'effect';
import { berlinDay, daysEndingOn } from './berlin-day';
import type { Snapshot, SnapshotAttempt, SnapshotChange } from './snapshot';
import type { Verdict } from './verdict';

/** A merged change as fetched. `source` is undefined for a private repository. */
export type MergedChange = Readonly<{
  mergedAt: DateTime.Utc;
  linesChanged: number;
  verdict: Verdict;
  failedChecks: ReadonlyArray<string>;
  source:
    | Readonly<{
        repository: string;
        number: number;
        title: string;
        url: string;
      }>
    | undefined;
}>;

/** A failed check run on a pull request. `source` is undefined for a private repository. */
export type FailedAttempt = Readonly<{
  startedAt: DateTime.Utc;
  source:
    | Readonly<{
        repository: string;
        workflow: string;
        title: string;
        url: string;
      }>
    | undefined;
}>;

const byInstant = <A>(instant: (value: A) => DateTime.Utc): Order.Order<A> =>
  Order.mapInput(DateTime.Order, instant);

// A private change is published only when it passed, and then without
// anything that identifies it. Dropping the others here keeps a failed or
// unchecked private change out of the file the site is built from.
const publishable = (change: MergedChange): ReadonlyArray<SnapshotChange> => {
  if (change.source === undefined) {
    return change.verdict === 'passed'
      ? [{ verdict: 'passed', linesChanged: change.linesChanged, source: null }]
      : [];
  }
  return [
    {
      verdict: change.verdict,
      linesChanged: change.linesChanged,
      source: { ...change.source, failedChecks: change.failedChecks },
    },
  ];
};

const groupByDay = <A, B>(
  values: ReadonlyArray<A>,
  instant: (value: A) => DateTime.Utc,
  publish: (value: A) => ReadonlyArray<B>,
): ReadonlyMap<string, ReadonlyArray<B>> => {
  const groups = new Map<string, Array<B>>();
  for (const value of [...values].sort(byInstant(instant))) {
    const day = berlinDay(instant(value));
    groups.set(day, [...(groups.get(day) ?? []), ...publish(value)]);
  }
  return groups;
};

/**
 * Builds the published snapshot: the `dayCount` calendar days in Germany that
 * end on the day of `fetchedAt`, each with its changes in merge order and the
 * attempts that were sent back in the order they started.
 */
export const assembleSnapshot = ({
  fetchedAt,
  dayCount,
  changes,
  attempts,
}: Readonly<{
  fetchedAt: DateTime.Utc;
  dayCount: number;
  changes: ReadonlyArray<MergedChange>;
  attempts: ReadonlyArray<FailedAttempt>;
}>): Snapshot => {
  const updatedOn = berlinDay(fetchedAt);
  const changesByDay = groupByDay(
    changes,
    (change) => change.mergedAt,
    publishable,
  );
  const attemptsByDay = groupByDay(
    attempts,
    (attempt) => attempt.startedAt,
    (attempt): ReadonlyArray<SnapshotAttempt> => [
      { source: attempt.source ?? null },
    ],
  );
  const [firstDay, ...laterDays] = daysEndingOn(updatedOn, dayCount).map(
    (date) => ({
      date,
      changes: changesByDay.get(date) ?? [],
      sentBack: attemptsByDay.get(date) ?? [],
    }),
  );
  if (firstDay === undefined) {
    throw new RangeError('A snapshot covers at least one day.');
  }
  return { updatedOn, days: [firstDay, ...laterDays] };
};
