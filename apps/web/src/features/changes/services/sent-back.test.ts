import { describe, expect, it } from 'bun:test';
import { DateTime } from 'effect';
import { wasSentBack } from './sent-back';

const at = (time: string): DateTime.Utc =>
  DateTime.makeUnsafe(`2026-11-07T${time}Z`);

const merges = new Map([['merged-head', at('17:48:00')]]);

describe('wasSentBack', () => {
  it('counts a failed run on a commit that never merged', () => {
    expect(
      wasSentBack({ headSha: 'earlier', finishedAt: at('17:00:00') }, merges),
    ).toBe(true);
  });

  it('counts a failed run that finished before its change merged', () => {
    expect(
      wasSentBack(
        { headSha: 'merged-head', finishedAt: at('17:40:00') },
        merges,
      ),
    ).toBe(true);
  });

  it('leaves out a run that finished after its change had merged', () => {
    expect(
      wasSentBack(
        { headSha: 'merged-head', finishedAt: at('17:49:00') },
        merges,
      ),
    ).toBe(false);
  });
});
