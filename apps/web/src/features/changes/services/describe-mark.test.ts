import { describe, expect, it } from 'bun:test';
import { describeMark } from './describe-mark';
import type { Snapshot } from './snapshot';

const snapshot: Snapshot = {
  updatedOn: '2026-11-23',
  days: [
    {
      date: '2026-11-23',
      changes: [
        {
          verdict: 'passed',
          linesChanged: 854,
          source: {
            repository: 'davidvornholt/wordhold',
            number: 300,
            title: 'fix(practice): start due days at midnight',
            url: 'https://github.com/davidvornholt/wordhold/pull/300',
            failedChecks: [],
          },
        },
        { verdict: 'passed', linesChanged: 159, source: null },
        {
          verdict: 'failed',
          linesChanged: 8,
          source: {
            repository: 'storaged-project/libblockdev',
            number: 1227,
            title: 'tests: Read the exfatprogs version from stderr too',
            url: 'https://github.com/storaged-project/libblockdev/pull/1227',
            failedChecks: ['testing-farm:fedora-45-x86_64:revdeps_udisks'],
          },
        },
      ],
      sentBack: [
        { source: null },
        {
          source: {
            repository: 'davidvornholt/standards',
            workflow: 'Standards',
            title: 'fix(sync): keep the lock',
            url: 'https://github.com/davidvornholt/standards/actions/runs/1',
          },
        },
      ],
    },
  ],
  site: {
    repository: 'davidvornholt/portfolio',
    firstMergedOn: '2026-07-10',
    passed: 1,
    failed: 0,
    unchecked: 0,
  },
  elsewhere: [],
};

const at = (kind: 'change' | 'attempt', position: number) =>
  describeMark(snapshot, { date: '2026-11-23', kind, position });

describe('describeMark', () => {
  it('names a public change and links to it', () => {
    expect(at('change', 0)).toEqual({
      verdict: 'Its checks had passed',
      key: 'passed',
      project: 'davidvornholt/wordhold',
      title: 'fix(practice): start due days at midnight',
      reason: undefined,
      linesChanged: 854,
      href: 'https://github.com/davidvornholt/wordhold/pull/300',
    });
  });

  it('says only the size of a private change', () => {
    expect(at('change', 1)).toMatchObject({
      project: 'A private project',
      title: undefined,
      linesChanged: 159,
      href: undefined,
    });
  });

  it('says in plain words which check had failed', () => {
    expect(at('change', 2)).toMatchObject({
      verdict: 'It went live with a failed check',
      key: 'failed',
      reason:
        'A test run on Fedora had failed, and the project’s maintainers merged the change.',
    });
  });

  it('describes a sent-back attempt, a private one without its name', () => {
    expect(at('attempt', 0)).toEqual({
      verdict: 'Sent back by the checks',
      key: 'caught',
      project: 'A private project',
      title: undefined,
      reason: undefined,
      linesChanged: undefined,
      href: undefined,
    });
    expect(at('attempt', 1)).toMatchObject({
      project: 'davidvornholt/standards',
      reason: 'The “Standards” checks failed.',
    });
  });

  it('has nothing to say about a mark the snapshot does not hold', () => {
    expect(at('change', 9)).toBeUndefined();
    expect(
      describeMark(snapshot, {
        date: '2026-01-01',
        kind: 'change',
        position: 0,
      }),
    ).toBeUndefined();
  });
});
