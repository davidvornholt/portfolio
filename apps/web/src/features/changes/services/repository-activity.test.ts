import { describe, expect, it } from 'bun:test';
import { repositoryActivity } from './repository-activity';
import type { SnapshotChange, SnapshotDay } from './snapshot';

const publicChange = (repository: string): SnapshotChange => ({
  verdict: 'passed',
  linesChanged: 1,
  source: {
    repository,
    number: 1,
    title: 'change',
    url: 'https://example',
    failedChecks: [],
  },
});

const privateChange: SnapshotChange = {
  verdict: 'passed',
  linesChanged: 1,
  source: null,
};

const day = (
  index: number,
  changes: ReadonlyArray<SnapshotChange>,
): SnapshotDay => ({
  date: `2026-11-${String(index).padStart(2, '0')}`,
  changes,
  sentBack: [],
});

describe('repositoryActivity', () => {
  it('counts the changes of each public repository per week', () => {
    const days = Array.from({ length: 14 }, (_, index) =>
      day(
        index + 1,
        index < 7
          ? [publicChange('davidvornholt/standards')]
          : [
              publicChange('davidvornholt/standards'),
              publicChange('davidvornholt/rota'),
            ],
      ),
    );

    const week = Array.from({ length: 7 }, () => 'passed' as const);
    expect(repositoryActivity(days)).toEqual([
      { repository: 'davidvornholt/standards', weeks: [week, week], total: 14 },
      { repository: 'davidvornholt/rota', weeks: [[], week], total: 7 },
    ]);
  });

  it('leaves out changes in private repositories', () => {
    const days = [day(1, [privateChange, privateChange])];

    expect(repositoryActivity(days)).toEqual([]);
  });
});
