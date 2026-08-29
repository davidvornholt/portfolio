import { describe, expect, it } from 'bun:test';
import { extractRunScript, readWorkflow } from './workflow-test-helpers';

const producer = await readWorkflow('publish-container.yml');
const consumer = await readWorkflow('pr-preview-deploy.yml');
const githubExpression = (expression: string): string =>
  `\${{ ${expression} }}`;

describe('preview producer trust boundary', () => {
  const pullRequestJob = producer.slice(
    producer.indexOf('  container-smoke:'),
    producer.indexOf('  gate:'),
  );

  it('grants untrusted pull request code only repository read access', () => {
    expect(pullRequestJob).toContain('    permissions:\n      contents: read');
    expect(pullRequestJob).not.toContain('      actions: read');
    expect(pullRequestJob).not.toContain('      pull-requests: read');
    expect(pullRequestJob).not.toContain('GH_TOKEN:');
    expect(pullRequestJob).not.toContain('gh api');
  });

  it('checks out and gates the exact pull request head before packaging', () => {
    const checkout = pullRequestJob.indexOf(
      `ref: ${githubExpression('github.event.pull_request.head.sha')}`,
    );
    const assertion = pullRequestJob.indexOf(
      'test "$(git rev-parse HEAD)" = "$HEAD_SHA"',
    );
    const gate = pullRequestJob.indexOf(
      'name: Run the full exact-head repository gate',
    );
    const packageArtifact = pullRequestJob.indexOf(
      'name: Package the eligible exact-head preview artifact',
    );

    expect(checkout).toBeGreaterThan(0);
    expect(assertion).toBeGreaterThan(checkout);
    expect(gate).toBeGreaterThan(assertion);
    expect(packageArtifact).toBeGreaterThan(gate);
    expect(pullRequestJob).toContain('bun run check');
  });

  it('builds every eligible edit so a retarget into main is not missed', () => {
    expect(producer).toContain('      - edited');
    expect(pullRequestJob).not.toContain('github.event.changes.base');
    expect(pullRequestJob).not.toContain("github.event.action != 'edited'");
    expect(pullRequestJob).toContain(
      'github.event.pull_request.head.repo.full_name == github.repository',
    );
  });

  it('does not let an unrelated label start a new producer run', () => {
    expect(pullRequestJob).toContain(
      "contains(github.event.pull_request.labels.*.name, 'pr-preview')",
    );
    expect(pullRequestJob).toContain(
      "github.event.action != 'labeled' || github.event.label.name == 'pr-preview'",
    );
  });

  it('keeps every workflow run in the FIFO queue without cancellation', () => {
    expect(producer).toContain('  cancel-in-progress: false');
    expect(producer).not.toContain('cancel-in-progress: true');
  });

  it('uses the host-owned preview label on every image boundary', () => {
    expect(pullRequestJob).toContain(
      'io.personal-infra.portfolio-preview=true',
    );
    expect(pullRequestJob).toContain(
      'index .Config.Labels "io.personal-infra.portfolio-preview"',
    );
    expect(producer).not.toContain('online.vornholt.portfolio.preview');
  });
});

describe('trusted preview consumer boundary', () => {
  const selector = extractRunScript(
    consumer,
    'Select an exact current preview operation',
  );
  const artifact = extractRunScript(
    consumer,
    'Fetch and validate the exact gated artifact',
  );

  it('binds runs to the base-owned producer identity', () => {
    expect(selector).toContain('test "$EVENT_WORKFLOW_ID" = 316903523');
    expect(selector).toContain('test "$EVENT_NAME" = \'Publish container\'');
    expect(selector).toContain(
      'test "$EVENT_PATH" = .github/workflows/publish-container.yml',
    );
    expect(selector).toContain(
      'test "$(jq -er .head_sha <<<"$run")" = "$EVENT_HEAD_SHA"',
    );
  });

  it('checks trusted workflow blobs only on the deploy path', () => {
    const deployOnlyGate = selector.indexOf('if [ "$mode" = deploy ]; then');
    const blobGate = selector.indexOf(
      'if ! trusted_workflows_match_main; then',
      deployOnlyGate,
    );
    const output = selector.indexOf('echo "mode=$mode"');

    expect(deployOnlyGate).toBeGreaterThan(0);
    expect(blobGate).toBeGreaterThan(deployOnlyGate);
    expect(output).toBeGreaterThan(blobGate);
    expect(selector).toContain('.github/workflows/pr-preview-deploy.yml');
    expect(selector).toContain('.github/workflows/pr-preview-host-command.yml');
  });

  it('discovers Standards independently and binds the exact producer gate step', () => {
    expect(artifact).toContain(
      'actions/runs/$RUN_ID/attempts/$RUN_ATTEMPT/jobs?per_page=100',
    );
    expect(artifact).toContain(
      'select(.name == "Run the full exact-head repository gate")',
    );
    expect(artifact).toContain('actions/workflows/standards.yml');
    expect(artifact).toContain('select(.name == "check")');
    expect(artifact).not.toContain('.standards.runId');
  });

  it('rejects oversized, malformed, or structurally unexpected artifacts', () => {
    expect(artifact).toContain(
      '.size_in_bytes | select(. > 0 and . <= 1610612736)',
    );
    expect(artifact).toContain('test "$metadata_size" -le 65536');
    expect(artifact).toContain('test "$archive_size" -le 1610612736');
    expect(artifact).toContain(
      'test "$entries" = $\'metadata.json\\nportfolio-image.tar.gz\'',
    );
    expect(artifact).toContain('timeout 5m gzip --test');
    expect(artifact).toContain('ulimit -f 2097152');
    expect(artifact).toContain('test "$image_tar_size" -le 2147483648');
    expect(artifact).toContain(
      'cmp "$RUNNER_TEMP/expected-metadata.json" "$metadata"',
    );
  });

  it('resolves the pushed image digest from the registry manifest', () => {
    const publish = extractRunScript(
      consumer,
      'Publish and prove the exact public digest',
    );

    expect(publish).toContain('docker image push "$IMAGE:$tag"');
    expect(publish).toContain('docker buildx imagetools inspect "$IMAGE:$tag"');
    expect(publish).toContain("--format '{{json .Manifest}}' | jq -er .digest");
    expect(publish).not.toContain('push_output=');
  });
});
