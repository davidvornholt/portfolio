import { describe, expect, it } from 'bun:test';
import rawSnapshot from '../data/changes.json' with { type: 'json' };
import { decodeSnapshot, encodeSnapshot } from './snapshot';

type Entries = 'changes' | 'sentBack';

// The committed file with `extra` added to its first change, or sent-back
// attempt, that has no source, which is one from a private repository. The
// file has both, and without one a test here fails because nothing throws.
const withExtra = (
  entries: Entries,
  extra: Readonly<Record<string, unknown>>,
): unknown => {
  let added = false;
  return {
    ...rawSnapshot,
    days: rawSnapshot.days.map((day) => ({
      ...day,
      [entries]: day[entries].map((entry) => {
        if (added || entry.source !== null) {
          return entry;
        }
        added = true;
        return { ...entry, ...extra };
      }),
    })),
  };
};

describe('decodeSnapshot', () => {
  it('accepts the committed file', () => {
    expect(() => {
      decodeSnapshot(rawSnapshot);
    }).not.toThrow();
  });

  it.each([
    ['title', 'fix(billing): refund twice'],
    ['repository', 'private-owner/secret-repository'],
    ['number', 7],
    ['url', 'https://github.com/private-owner/secret-repository/pull/7'],
  ])('rejects a private change that carries a %s', (property, value) => {
    expect(() => {
      decodeSnapshot(withExtra('changes', { [property]: value }));
    }).toThrow('Expected no excess property');
  });

  it('rejects a private sent-back attempt that carries a title', () => {
    expect(() => {
      decodeSnapshot(withExtra('sentBack', { title: 'fix(billing): refund' }));
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
