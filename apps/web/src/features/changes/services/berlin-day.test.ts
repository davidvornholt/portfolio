import { describe, expect, it } from 'bun:test';
import { DateTime } from 'effect';
import { berlinDay, daysEndingOn } from './berlin-day';

describe('berlinDay', () => {
  it('moves a late UTC evening to the next German day', () => {
    expect(berlinDay(DateTime.makeUnsafe('2026-11-22T23:30:00Z'))).toBe(
      '2026-11-23',
    );
  });

  it('follows summer time', () => {
    expect(berlinDay(DateTime.makeUnsafe('2026-08-24T22:00:00Z'))).toBe(
      '2026-08-25',
    );
    expect(berlinDay(DateTime.makeUnsafe('2026-08-24T21:59:59Z'))).toBe(
      '2026-08-24',
    );
  });
});

describe('daysEndingOn', () => {
  it('lists the days oldest first and ends with the given day', () => {
    expect(daysEndingOn('2026-11-01', 3)).toEqual([
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
    ]);
  });

  it('covers thirteen weeks across the end of summer time', () => {
    const days = daysEndingOn('2026-11-23', 91);

    expect(days).toHaveLength(91);
    expect(days[0]).toBe('2026-08-25');
    expect(new Set(days).size).toBe(91);
  });
});
