import { expect, it } from 'bun:test';
import { chartWindow, desktopWeeks, phoneWeeks } from './geometry';
import snapshot from './snapshot.json' with { type: 'json' };

it('keeps one mark and one weekly count for each publishable change', () => {
  const { points, totals } = chartWindow(desktopWeeks);
  expect(points.length).toBe(snapshot.count);
  expect(
    totals.reduce(
      (sum, w) => sum + w.passed + w.failed + w.untested + w.skipped,
      0,
    ),
  ).toBe(points.length);
  expect(
    points.every(
      (p) => p.size > 0 && Number.isFinite(p.x) && Number.isFinite(p.y),
    ),
  ).toBe(true);
  const mobile = chartWindow(phoneWeeks);
  expect(mobile.days.at(-1)?.date).toBe(snapshot.end);
  const start = points.length - mobile.points.length;
  expect(
    mobile.points.every(
      (point, i) => point.change === points[start + i]?.change,
    ),
  ).toBe(true);
});

it('publishes only the date, size, and passing result for private work', () => {
  const privateRecords = snapshot.changes.filter(
    (record) => !('url' in record),
  );
  expect(privateRecords.length).toBeGreaterThan(0);
  expect(
    privateRecords.every(
      (record) =>
        Object.keys(record)
          .sort((a, b) => a.localeCompare(b))
          .join() === 'date,lines,result' && record.result === 'passed',
    ),
  ).toBe(true);
});
