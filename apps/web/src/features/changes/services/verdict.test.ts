import { describe, expect, it } from 'bun:test';
import { DateTime } from 'effect';
import { type CheckRun, judgeAtMerge } from './verdict';

const at = (time: string): DateTime.Utc =>
  DateTime.makeUnsafe(`2026-11-07T${time}Z`);

const run = (
  check: string,
  outcome: CheckRun['outcome'],
  startedAt: string,
  finishedAt: string | undefined,
): CheckRun => ({
  check,
  label: check,
  startedAt: at(startedAt),
  finishedAt: finishedAt === undefined ? undefined : at(finishedAt),
  outcome,
});

const mergedAt = at('17:48:00');

describe('judgeAtMerge', () => {
  it('passes a change whose checks had all passed', () => {
    expect(
      judgeAtMerge(mergedAt, [
        run('check', 'passed', '17:30:00', '17:40:00'),
        run('build', 'passed', '17:30:00', '17:35:00'),
      ]),
    ).toEqual({ verdict: 'passed', failedChecks: [] });
  });

  it('lets a newer run replace an older failed run of the same check', () => {
    expect(
      judgeAtMerge(mergedAt, [
        run('check', 'failed', '17:30:00', '17:38:00'),
        run('check', 'passed', '17:40:00', '17:45:00'),
      ]),
    ).toEqual({ verdict: 'passed', failedChecks: [] });
  });

  it('fails a change when the latest finished run of a check had failed', () => {
    expect(
      judgeAtMerge(mergedAt, [
        run('check', 'passed', '17:20:00', '17:25:00'),
        run('check', 'failed', '17:30:00', '17:38:00'),
        run('build', 'passed', '17:30:00', '17:35:00'),
      ]),
    ).toEqual({ verdict: 'failed', failedChecks: ['check'] });
  });

  it('ignores a run that failed after the merge', () => {
    expect(
      judgeAtMerge(mergedAt, [
        run('check', 'passed', '17:30:00', '17:40:00'),
        run('preview clean-up', 'failed', '17:48:05', '17:49:00'),
      ]),
    ).toEqual({ verdict: 'passed', failedChecks: [] });
  });

  it('ignores a run that was still going when the change merged', () => {
    expect(
      judgeAtMerge(mergedAt, [
        run('check', 'passed', '17:40:00', '17:50:00'),
        run('build', 'neutral', '17:40:00', undefined),
      ]),
    ).toEqual({ verdict: 'unchecked', failedChecks: [] });
  });

  it('counts a run that finished in the second of the merge', () => {
    expect(
      judgeAtMerge(mergedAt, [run('check', 'passed', '17:40:00', '17:48:00')]),
    ).toEqual({ verdict: 'passed', failedChecks: [] });
  });

  it('calls a change unchecked when nothing passed and nothing failed', () => {
    expect(judgeAtMerge(mergedAt, [])).toEqual({
      verdict: 'unchecked',
      failedChecks: [],
    });
    expect(
      judgeAtMerge(mergedAt, [
        run('skipped', 'neutral', '17:30:00', '17:31:00'),
      ]),
    ).toEqual({ verdict: 'unchecked', failedChecks: [] });
  });
});
