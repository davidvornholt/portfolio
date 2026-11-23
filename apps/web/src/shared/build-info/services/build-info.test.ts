import { describe, expect, it } from 'bun:test';
import { buildInfo, decodeBuildInfo } from './build-info';

describe('build info', () => {
  it('makes no claim for the file that is checked in', () => {
    expect(buildInfo).toBeNull();
  });

  it('reads the commit the publishing workflow wrote', () => {
    const written = {
      sha: 'd356c99c0ffee',
      title: 'docs: say "checks" in $PLAIN words (#143)',
      committedOn: '2026-11-23',
      released: true,
    };

    expect(decodeBuildInfo(written)).toEqual(written);
  });

  it('rejects a file that names only part of a commit', () => {
    expect(() =>
      decodeBuildInfo({ sha: 'd356c99c0ffee', title: '', released: true }),
    ).toThrow();
  });
});
