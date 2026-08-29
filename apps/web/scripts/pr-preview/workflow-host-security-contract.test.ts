import { describe, expect, it } from 'bun:test';
import { extractRunScript, readWorkflow } from './workflow-test-helpers';

const consumer = await readWorkflow('pr-preview-deploy.yml');
const hostCommand = await readWorkflow('pr-preview-host-command.yml');
const githubExpression = (expression: string): string =>
  `\${{ ${expression} }}`;

describe('preview host authorization and secret boundary', () => {
  it('uses only the dedicated main-only environment secret contract', () => {
    expect(hostCommand).toContain('      name: pr-preview');
    const sopsAgeKey = githubExpression('secrets.sops_age_key');
    expect(hostCommand).toContain(`SOPS_AGE_KEY: ${sopsAgeKey}`);
    expect(hostCommand).toContain('      sops_age_key:');
    expect(hostCommand).toContain('        required: true');
    const hostCommandCalls = consumer.match(
      /uses: \.\/\.github\/workflows\/pr-preview-host-command\.yml/gu,
    );
    const explicitSecretPasses = consumer.match(
      /sops_age_key: \$\{\{ secrets\.SOPS_AGE_KEY \}\}/gu,
    );
    expect(explicitSecretPasses).toHaveLength(hostCommandCalls?.length ?? -1);
    expect(hostCommand).toContain('secrets/pr-preview.yaml?ref=$main_sha');
    expect(hostCommand).toContain(`printf '\\n' >>"$key"`);
    expect(hostCommand).toContain('ssh-keygen -y -f "$key" >/dev/null');
    expect(hostCommand).not.toContain('public_key=$(ssh-keygen -y');
    expect(hostCommand).not.toContain('secrets: inherit');
    expect(hostCommand).not.toContain('secrets/ci.yaml');
  });

  it('allows only the exact forced-command shapes after a current PR check', () => {
    expect(hostCommand).toContain("printf 'command=deploy %s %s %s\\n'");
    expect(hostCommand).toContain("printf 'command=destroy %s\\n'");
    expect(hostCommand).toContain(
      'pr=$(gh api "repos/$REPOSITORY/pulls/$PR_NUMBER")',
    );
    expect(hostCommand).toContain(
      `PREVIOUS_BASE_REF: ${githubExpression('inputs.previous-base-ref')}`,
    );
    expect(hostCommand).toContain('test "$current_head" = "$HEAD_SHA"');
    expect(hostCommand).toContain('StrictHostKeyChecking=yes');
    expect(hostCommand).toContain(
      'prod-1.vornholt.online ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFkom7Y24gnBa9X+gUDBZvlCnXiuKTo87ROOtlMpgNH5',
    );
  });

  it('hands lifecycle teardown to an immutable default-branch dispatch', () => {
    const dispatch = extractRunScript(
      consumer,
      'Dispatch trusted default-branch preview teardown',
    );

    expect(consumer).toContain('  repository_dispatch:');
    expect(consumer).toContain(
      "needs.select.outputs.mode == 'dispatch-ineligible'",
    );
    expect(dispatch).toContain(
      'repos/$REPOSITORY/dispatches',
    );
    const selector = extractRunScript(
      consumer,
      'Select an exact current preview operation',
    );
    expect(selector).toContain(
      'test "$GITHUB_REF" = refs/heads/main',
    );
    expect(dispatch).toContain('event_type=portfolio-preview-teardown');
    expect(dispatch).toContain('client_payload[pr_number]');
  });

  it('retries teardown after publication, deploy, or health failure', () => {
    expect(consumer).toContain('  cleanup-failed-publication:');
    expect(consumer).toContain('  cleanup-failed-deploy:');
    expect(hostCommand).toContain(
      'failed-build|failed-publication|failed-deploy',
    );
  });
});
