import { describe, expect, it } from 'bun:test';
import { apiRecord, eligiblePullRequest } from './preview-selection-fixtures';
import { runSelection } from './workflow-test-helpers';

describe('trusted preview lifecycle selection', () => {
  it.each([
    ['closed', eligiblePullRequest({ state: 'closed' })],
    ['converted_to_draft', eligiblePullRequest({ draft: true })],
    ['unlabeled', eligiblePullRequest({ labels: [] })],
  ])('tears down a main-lane preview when the pull request is %s', (action, pullRequest) => {
    const result = runSelection({
      action,
      pullRequest,
      trigger: 'pull_request_target',
    });

    expect(result.exitCode).toBe(0);
    expect(result.outputs.mode).toBe('destroy-ineligible');
    expect(result.outputs['pull-request-number']).toBe('35');
  });

  it('tears down a preview retargeted away from main', () => {
    const result = runSelection({
      action: 'edited',
      baseFrom: 'main',
      pullRequest: eligiblePullRequest({
        base: apiRecord([
          ['repo', apiRecord([['full_name', 'davidvornholt/portfolio']])],
          ['ref', 'stacked'],
        ]),
      }),
      trigger: 'pull_request_target',
    });

    expect(result.exitCode).toBe(0);
    expect(result.outputs.mode).toBe('destroy-ineligible');
    expect(result.outputs['previous-base-ref']).toBe('main');
  });

  it('leaves a pull request entering main for the producer to rebuild', () => {
    const result = runSelection({
      action: 'edited',
      baseFrom: 'stacked',
      trigger: 'pull_request_target',
    });

    expect(result.exitCode).toBe(0);
    expect(result.outputs.mode).toBe('none');
    expect(result.log).toBe('');
  });

  it('ignores edits that do not change the base branch', () => {
    const result = runSelection({
      action: 'edited',
      trigger: 'pull_request_target',
    });

    expect(result.exitCode).toBe(0);
    expect(result.outputs.mode).toBe('none');
    expect(result.log).toBe('');
  });

  it('rechecks current state before teardown', () => {
    const result = runSelection({
      action: 'converted_to_draft',
      pullRequest: eligiblePullRequest(),
      trigger: 'pull_request_target',
    });

    expect(result.exitCode).toBe(0);
    expect(result.outputs.mode).toBe('none');
  });
});
