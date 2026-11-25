import { describe, expect, it } from 'bun:test';
import {
  checkOutput,
  diffOutput,
  gateOutput,
  passedCheckOutput,
  statusOutput,
  syncOutput,
} from './loosened-rule';
import { initialShellState, runCommand } from './terminal-shell';

const typing = (...commands: ReadonlyArray<string>) =>
  commands.reduce(
    (answer, command) => runCommand(answer.state, command),
    runCommand(initialShellState, ''),
  );

const textOf = (...commands: ReadonlyArray<string>): ReadonlyArray<string> =>
  typing(...commands).lines.map((line) => line.text);

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
    expect(typing('vim').lines[0]?.text).toContain('Type help');
    expect(typing('').lines).toEqual([]);
  });

  it('does not let the checks be skipped', () => {
    const skipped = typing('git commit --no-verify -m "quick fix"');

    expect(skipped.lines[0]?.text).toContain('pull request');
    expect(skipped.state.rule).toBe('loosened');
  });

  it('runs the whole gate, which stops at the loosened rule', () => {
    expect(typing('bun run check').lines).toEqual(gateOutput.failed);
    expect(typing('git restore .', 'bun run check').lines).toEqual(
      gateOutput.passed,
    );
  });

  it('reports the state of the working tree', () => {
    expect(typing('git status').lines).toEqual(statusOutput.loosened);
    expect(typing('bun standards sync', 'git status').lines).toEqual(
      statusOutput.clean,
    );
  });

  it('lists the folder in columns, down each column first', () => {
    const rows = textOf('ls');

    expect(rows[0]?.startsWith('AGENTS.local.md')).toBe(true);
    expect(rows[1]?.startsWith('AGENTS.md')).toBe(true);
    expect(rows.join(' ')).toContain('turbo.json');
  });

  it('answers the small commands a visitor tries first', () => {
    expect(textOf('pwd')).toEqual(['/home/david/dev/portfolio']);
    expect(textOf('echo  hello   there')).toEqual(['hello there']);
    expect(textOf('git branch')).toEqual(['* main']);
    expect(textOf('git log --oneline')).toHaveLength(5);
  });

  it('says where it ends, tool by tool', () => {
    expect(textOf('git push')[0]).toContain('git: this terminal knows');
    expect(textOf('bun install')[0]).toContain('bun: this terminal knows');
    expect(textOf('cat AGENTS.md')[0]).toContain('holds no files');
    expect(textOf('cd apps')[0]).toContain('stays in');
  });
});
