import { describe, expect, it } from 'bun:test';
import {
  checkOutput,
  diffOutput,
  passedCheckOutput,
  syncOutput,
} from './loosened-rule';
import { initialShellState, runCommand } from './terminal-shell';

const typing = (...commands: ReadonlyArray<string>) =>
  commands.reduce(
    (answer, command) => runCommand(answer.state, command),
    runCommand(initialShellState, ''),
  );

describe("the terminal's commands", () => {
  it('fails the check while the rule is loosened', () => {
    expect(typing('bun standards check').lines).toEqual(checkOutput);
  });

  it('passes the check once git has restored the rule', () => {
    const restored = typing('git restore AGENTS.md');

    expect(restored.lines).toEqual([]);
    expect(runCommand(restored.state, 'bun standards check').lines).toEqual(
      passedCheckOutput,
    );
  });

  it('passes the check once the rulebook was synced', () => {
    const synced = typing('bun standards sync');

    expect(synced.lines).toEqual(syncOutput.restored);
    expect(runCommand(synced.state, 'bun standards check').lines).toEqual(
      passedCheckOutput,
    );
    expect(runCommand(synced.state, 'bun standards sync').lines).toEqual(
      syncOutput.nothingToRestore,
    );
  });

  it('shows the change only while it is there', () => {
    expect(typing('git diff').lines).toEqual(diffOutput);
    expect(typing('git checkout AGENTS.md', 'git diff').lines).toEqual([]);
  });

  it('says how many paths a checkout restored', () => {
    expect(typing('git checkout AGENTS.md').lines[0]?.text).toBe(
      'Updated 1 path from the index',
    );
    expect(
      typing('git restore .', 'git checkout -- AGENTS.md').lines[0]?.text,
    ).toBe('Updated 0 paths from the index');
  });

  it('reads a command whatever its spacing', () => {
    expect(typing('  bun   standards  check ').lines).toEqual(checkOutput);
  });

  it('empties the screen and keeps the state', () => {
    const cleared = typing('git restore AGENTS.md', 'clear');

    expect(cleared.clears).toBe(true);
    expect(cleared.state.rule).toBe('restored');
  });

  it('lists its commands, and points there from anything else', () => {
    const listed = typing('help').lines.map((line) => line.text);

    expect(listed.some((line) => line.startsWith('bun standards check'))).toBe(
      true,
    );
    expect(typing('ls').lines[0]?.text).toContain('Type help');
    expect(typing('').lines).toEqual([]);
  });

  it('does not let the checks be skipped', () => {
    const skipped = typing('git commit --no-verify -m "quick fix"');

    expect(skipped.lines[0]?.text).toContain('pull request');
    expect(skipped.state.rule).toBe('loosened');
  });
});
