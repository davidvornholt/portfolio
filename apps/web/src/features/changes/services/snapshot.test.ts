import { describe, expect, it } from 'bun:test';
import rawSnapshot from '../data/changes.json' with { type: 'json' };
import { decodeSnapshot, encodeSnapshot } from './snapshot';

type Entries = 'changes' | 'sentBack';

// A change and a sent-back attempt as a private repository leaves them.
const privateEntry = {
  changes: { verdict: 'passed', linesChanged: 1, source: null },
  sentBack: { source: null },
} as const;

// The committed file with one more private entry on its first day, which
// carries `extra`. The entry is added here, so the tests don't depend on the
// committed weeks holding a private change or attempt.
const withPrivateEntry = (
  entries: Entries,
  extra: Readonly<Record<string, unknown>> = {},
): unknown => {
  const [firstDay, ...laterDays] = rawSnapshot.days;
  return {
    ...rawSnapshot,
    days: [
      {
        ...firstDay,
        [entries]: [
          ...(firstDay?.[entries] ?? []),
          { ...privateEntry[entries], ...extra },
        ],
      },
      ...laterDays,
    ],
  };
};

describe('decodeSnapshot', () => {
  it('accepts the committed file', () => {
    expect(() => {
      decodeSnapshot(rawSnapshot);
    }).not.toThrow();
  });

  it.each(['changes', 'sentBack'] as const)(
    'accepts a private entry among the %s',
    (entries) => {
      expect(() => {
        decodeSnapshot(withPrivateEntry(entries));
      }).not.toThrow();
    },
  );

  it.each([
    ['title', 'fix(billing): refund twice'],
    ['repository', 'private-owner/secret-repository'],
    ['number', 7],
    ['url', 'https://github.com/private-owner/secret-repository/pull/7'],
  ])('rejects a private change that carries a %s', (property, value) => {
    expect(() => {
      decodeSnapshot(withPrivateEntry('changes', { [property]: value }));
    }).toThrow('Expected no excess property');
  });

  it('rejects a private sent-back attempt that carries a title', () => {
    expect(() => {
      decodeSnapshot(
        withPrivateEntry('sentBack', { title: 'fix(billing): refund' }),
      );
    }).toThrow('Expected no excess property');
  });
});

describe('encodeSnapshot', () => {
  it('refuses to write a private change that carries a title', () => {
    const snapshot = decodeSnapshot(rawSnapshot);
    const [firstDay, ...laterDays] = snapshot.days;
    const withTitle = {
      ...snapshot,
      days: [
        {
          ...firstDay,
          changes: [
            {
              verdict: 'passed' as const,
              linesChanged: 1,
              source: null,
              title: 'fix(billing): refund twice',
            },
          ],
        },
        ...laterDays,
      ] as const,
    };

    expect(() => {
      encodeSnapshot(withTitle);
    }).toThrow('Expected no excess property');
  });
});
