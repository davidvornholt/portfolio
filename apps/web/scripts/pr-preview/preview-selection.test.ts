import { describe, expect, it } from 'bun:test';
import { apiRecord, eligiblePullRequest } from './preview-selection-fixtures';
import { runSelection } from './workflow-test-helpers';

describe('trusted preview workflow-run selection', () => {
  it('deploys only after the trusted workflow and blob checks succeed', () => {
    const result = runSelection();

    expect(result.exitCode).toBe(0);
    expect(result.outputs.mode).toBe('deploy');
    expect(result.outputs['pull-request-number']).toBe('35');
    expect(result.log).toContain(
      '/contents/.github/workflows/publish-container.yml',
    );
    expect(result.log).toContain('/contents/.github/workflows/standards.yml');
  });

  it.each(['failure', 'cancelled', 'timed_out'])(
    'destroys the current preview after a %s build without consulting head-owned blobs',
    (conclusion) => {
      const result = runSelection({ conclusion });

      expect(result.exitCode).toBe(0);
      expect(result.outputs.mode).toBe('destroy-failed-build');
      expect(result.log).not.toContain('/contents/');
    },
  );

  it('does not mutate preview state for a skipped build', () => {
    const result = runSelection({ conclusion: 'skipped' });

    expect(result.exitCode).toBe(0);
    expect(result.outputs.mode).toBe('none');
  });

  it('does not deploy when an unrelated edit skipped the producer job', () => {
    const result = runSelection({ producerJobConclusion: 'skipped' });

    expect(result.exitCode).toBe(0);
    expect(result.outputs.mode).toBe('none');
  });

  it('fails closed for an unknown conclusion', () => {
    const result = runSelection({ conclusion: 'neutral' });

    expect(result.exitCode).not.toBe(0);
    expect(result.outputs.mode).toBe('none');
  });

  it('recovers an empty direct association from the exact commit', () => {
    const result = runSelection({
      directAssociations: [],
      associated: [eligiblePullRequest()],
      conclusion: 'failure',
    });

    expect(result.exitCode).toBe(0);
    expect(result.outputs.mode).toBe('destroy-failed-build');
  });

  it('refuses an ambiguous exact-commit association', () => {
    const result = runSelection({
      directAssociations: [{ number: 35 }, { number: 36 }],
      associated: [eligiblePullRequest(), eligiblePullRequest({ number: 36 })],
      conclusion: 'failure',
    });

    expect(result.exitCode).toBe(0);
    expect(result.outputs.mode).toBe('none');
  });

  it('does not let an older run overwrite newer preview state', () => {
    const newerRunId = 101;
    const newerRunNumber = 11;
    const result = runSelection({
      candidates: [
        apiRecord([
          ['id', newerRunId],
          ['run_attempt', 1],
          ['run_number', newerRunNumber],
          ['path', '.github/workflows/publish-container.yml'],
          ['event', 'pull_request'],
          [
            'head_repository',
            apiRecord([['full_name', 'davidvornholt/portfolio']]),
          ],
        ]),
      ],
      conclusion: 'failure',
    });

    expect(result.exitCode).toBe(0);
    expect(result.outputs.mode).toBe('none');
  });
});
