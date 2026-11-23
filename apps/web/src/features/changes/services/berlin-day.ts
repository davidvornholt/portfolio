import { DateTime } from 'effect';

const berlin = 'Europe/Berlin';

/** The calendar day in Germany on which an instant falls, as `YYYY-MM-DD`. */
export const berlinDay = (instant: DateTime.Utc): string =>
  DateTime.formatIsoDate(DateTime.setZoneNamedUnsafe(instant, berlin));

/** The `count` calendar days that end with `lastDay`, oldest first. */
export const daysEndingOn = (
  lastDay: string,
  count: number,
): ReadonlyArray<string> => {
  // Noon keeps the arithmetic clear of the day boundary.
  const noon = DateTime.makeUnsafe(`${lastDay}T12:00:00Z`);
  return Array.from({ length: count }, (_, index) =>
    DateTime.formatIsoDateUtc(
      DateTime.subtract(noon, { days: count - 1 - index }),
    ),
  );
};
