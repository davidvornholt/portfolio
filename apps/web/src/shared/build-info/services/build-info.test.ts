import { describe, expect, it } from 'bun:test';
import { buildInfo, decodeBuildInfo } from './build-info';

const commit = {
  sha: 'd356c99c0ffee0d356c99c0ffee0d356c99c0ffe',
  title: 'docs: say "checks" in $PLAIN words (#143)',
  committedOn: '2026-11-23',
  released: true,
};

describe('build info', () => {
  it('makes no claim for the file that is checked in', () => {
    expect(buildInfo).toBeNull();
  });

  it('reads the commit the publishing workflow wrote', () => {
    expect(decodeBuildInfo({ commit })).toEqual(commit);
  });

  it.each([
    ['a shortened hash', { sha: 'd356c99' }],
    ['a word in place of the hash', { sha: 'unknown' }],
    ['a date that is none', { committedOn: 'unknown' }],
    ['a date with its time', { committedOn: '2026-11-23T10:00:00Z' }],
    ['a day its month does not have', { committedOn: '2026-02-29' }],
    ['a month the year does not have', { committedOn: '2026-13-01' }],
  ])('rejects %s', (_what, wrong) => {
    expect(() =>
      decodeBuildInfo({ commit: { ...commit, ...wrong } }),
    ).toThrow();
  });

  it('accepts a leap day', () => {
    const leapDay = { ...commit, committedOn: '2024-02-29' };

    expect(decodeBuildInfo({ commit: leapDay })).toEqual(leapDay);
  });

  it('rejects a file that names only part of a commit', () => {
    expect(() =>
      decodeBuildInfo({
        commit: { sha: commit.sha, title: '', released: true },
      }),
    ).toThrow();
  });

  it('rejects a file without the commit field', () => {
    expect(() => decodeBuildInfo({})).toThrow();
  });
});
