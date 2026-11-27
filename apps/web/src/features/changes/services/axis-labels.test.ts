import { describe, expect, it } from 'bun:test';
import { axisLabels } from './axis-labels';
import { daysEndingOn } from './berlin-day';

const labelled = (lastDay: string) =>
  axisLabels(daysEndingOn(lastDay, 91)).flatMap((labels, index) =>
    labels.map((label) => [index, label.text, label.windows.join(' ')]),
  );

describe('axisLabels', () => {
  it('prints the first day of each window and the months with room', () => {
    expect(labelled('2026-11-23')).toEqual([
      [0, 'Aug 25', 'thirteenWeeks'],
      [7, 'September', 'thirteenWeeks'],
      [35, 'Sep 29', 'eightWeeks'],
      [37, 'October', 'thirteenWeeks'],
      [63, 'Oct 27', 'fourWeeks'],
      [68, 'November', 'eightWeeks thirteenWeeks'],
    ]);
  });

  it('leaves out a month that begins right before today', () => {
    expect(
      labelled('2026-12-03').filter(([, text]) => text === 'December'),
    ).toEqual([]);
  });
});
