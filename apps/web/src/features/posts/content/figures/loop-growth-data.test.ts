import { describe, expect, it } from 'bun:test';
import { loopGrowth, loopRun } from './loop-growth-data';

describe('the growth of the review loop', () => {
  it('holds every commit of the pull request, in order', () => {
    const commits = 70;
    expect(loopGrowth).toHaveLength(commits);
    const minutes = loopGrowth.map(([minute]) => minute);
    expect(minutes).toEqual([...minutes].sort((one, other) => one - other));
  });

  it('agrees with the points the article names', () => {
    expect(loopGrowth).toContainEqual([
      loopRun.kept.afterMinutes,
      loopRun.kept.lines,
    ]);
    expect(loopGrowth.at(-1)?.[1]).toBe(loopRun.finalLines);
    const repair = loopGrowth.findIndex(
      ([minute]) => minute === loopRun.largestRepair.afterMinutes,
    );
    expect(repair).toBeGreaterThan(0);
  });
});
