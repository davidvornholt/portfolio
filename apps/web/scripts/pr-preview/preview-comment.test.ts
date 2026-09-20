import { describe, expect, it } from 'bun:test';
import { extractRunScript, readWorkflow } from './workflow-test-helpers';

const script = extractRunScript(
  await readWorkflow('pr-preview-host-command.yml'),
  'Reconcile the pull request preview comment',
);
const marker = '<!-- portfolio-pr-preview -->';
const existingComment = {
  id: 123,
  user: { login: 'github-actions[bot]' },
  body: marker,
};
const runComment = (
  operation: string,
  outcome: string,
  comments: Array<unknown>,
) =>
  globalThis.Bun.spawnSync(
    [
      'bash',
      '-c',
      `
gh() {
  if [ "$2" = --paginate ]; then
    printf '%s' "$TEST_COMMENTS"
  elif [ "$2" = --method ]; then
    printf '%s\n' "$*" >&2
  else
    return 97
  fi
}
${script}
`,
    ],
    {
      env: {
        ...globalThis.Bun.env,
        ...Object.fromEntries([
          ['TEST_COMMENTS', JSON.stringify(comments)],
          ['HOST_IN_SCOPE', 'true'],
          ['HOST_OUTCOME', outcome],
          ['OPERATION', operation],
          ['HEAD_SHA', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'],
          ['PR_NUMBER', '42'],
          ['REPOSITORY', 'davidvornholt/portfolio'],
        ]),
      },
    },
  );

describe('preview status comments', () => {
  it.each(['success', 'failure'])(
    'does not create a comment for cleanup with outcome %s',
    (outcome) => {
      const result = runComment('destroy', outcome, []);
      expect(result.exitCode).toBe(0);
      expect(result.stderr.toString()).toBe('');
    },
  );

  it.each(['success', 'failure'])(
    'updates an existing preview after cleanup with outcome %s',
    (outcome) => {
      const result = runComment('destroy', outcome, [existingComment]);
      expect(result.exitCode).toBe(0);
      expect(result.stderr.toString()).toContain(
        '--method PATCH repos/davidvornholt/portfolio/issues/comments/123',
      );
      expect(result.stderr.toString()).toContain(
        outcome === 'success' ? 'State: removed' : 'State: removal failed',
      );
      expect(result.stderr.toString()).not.toContain('--method POST');
    },
  );

  it.each(['success', 'failure'])(
    'creates a deployment status with outcome %s',
    (outcome) => {
      const result = runComment('deploy', outcome, []);
      expect(result.exitCode).toBe(0);
      expect(result.stderr.toString()).toContain(
        '--method POST repos/davidvornholt/portfolio/issues/42/comments',
      );
    },
  );

  it('does not treat a user comment as a preview status', () => {
    const result = runComment('destroy', 'success', [
      { ...existingComment, user: { login: 'someone' } },
    ]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr.toString()).toBe('');
  });

  it('fails rather than choosing between duplicate preview comments', () => {
    const result = runComment('destroy', 'success', [
      existingComment,
      { ...existingComment, id: 456 },
    ]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr.toString()).not.toContain('--method');
  });
});
