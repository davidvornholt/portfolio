import { describe, expect, it } from 'bun:test';
import { buildInfo, decodeBuildInfo } from './build-info';

describe('build info', () => {
  it('makes no claim for the file that is checked in', () => {
    expect(buildInfo).toBeNull();
  });

  it('reads the commit the publishing workflow wrote', () => {
    const commit = {
      sha: 'd356c99c0ffee',
      title: 'docs: say "checks" in $PLAIN words (#143)',
      committedOn: '2026-11-23',
      released: true,
    };

    expect(decodeBuildInfo({ commit })).toEqual(commit);
  });

  it('rejects a file that names only part of a commit', () => {
    expect(() =>
      decodeBuildInfo({
        commit: { sha: 'd356c99c0ffee', title: '', released: true },
      }),
    ).toThrow();
  });

  it('rejects a file without the commit field', () => {
    expect(() => decodeBuildInfo({})).toThrow();
  });
});
