import { afterEach, describe, expect, it } from 'bun:test';
import { formatPostDate } from './format-post-date';

const originalTimeZone = globalThis.Bun.env.TZ;

afterEach(() => {
  if (originalTimeZone === undefined) {
    Reflect.deleteProperty(globalThis.Bun.env, 'TZ');
  } else {
    globalThis.Bun.env.TZ = originalTimeZone;
  }
});

describe('formatPostDate', () => {
  it.each([
    'UTC',
    'America/Los_Angeles',
    'Pacific/Honolulu',
    'Europe/Berlin',
    'Pacific/Kiritimati',
  ])('shows the calendar day of a date-only string in %s', (timeZone) => {
    globalThis.Bun.env.TZ = timeZone;

    expect(formatPostDate('2026-09-07')).toBe('September 7, 2026');
    expect(formatPostDate('2026-03-01')).toBe('March 1, 2026');
  });
});
