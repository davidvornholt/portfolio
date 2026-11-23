import { describe, expect, it } from 'bun:test';
import { extractRunScript, readWorkflow } from './workflow-test-helpers';

const producer = await readWorkflow('publish-container.yml');
const consumer = await readWorkflow('pr-preview-deploy.yml');
const rollBack = await readWorkflow('roll-back.yml');
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

  it('keeps producer and consumer runs in the FIFO queue without cancellation', () => {
    expect(pullRequestJob).toContain(
      [
        '    concurrency:',
        `      group: ${githubExpression('github.workflow')}-pr-${githubExpression('github.event.pull_request.number')}`,
        '      cancel-in-progress: false',
        '      queue: max',
      ].join('\n'),
    );
    expect(consumer).toContain('  cancel-in-progress: false');
    expect(consumer).toContain('  queue: max');
    expect(producer).not.toContain('cancel-in-progress: true');
    expect(consumer).not.toContain('cancel-in-progress: true');
  });

  it('reads the main layer cache without writing it', () => {
    expect(pullRequestJob).toContain(
      'cache-from: type=registry,ref=ghcr.io/davidvornholt/portfolio:buildcache',
    );
    expect(pullRequestJob).not.toContain('cache-to:');
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

describe('production release boundary', () => {
  const buildJob = producer.slice(
    producer.indexOf('  build:'),
    producer.indexOf('  release:'),
  );
  const releaseJob = producer.slice(producer.indexOf('  release:'));
  const releaseQueue = [
    '    concurrency:',
    '      group: app-release-portfolio',
    '      cancel-in-progress: false',
    '      queue: max',
  ].join('\n');
  const releasePermissions = [
    '    permissions:',
    '      contents: read',
    '      id-token: write',
    '      packages: write',
  ].join('\n');
  const knownHost =
    'known-host: prod-1.vornholt.online ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFkom7Y24gnBa9X+gUDBZvlCnXiuKTo87ROOtlMpgNH5';
  const canonicalRepository = "github.repository == 'davidvornholt/portfolio'";
  const mainRef = "github.ref == 'refs/heads/main'";

  it('builds the pushed commit beside the gate with its revision bound', () => {
    expect(buildJob).toContain("    if: github.event_name == 'push'");
    expect(buildJob).not.toContain('needs:');
    expect(buildJob).toContain(
      `org.opencontainers.image.revision=${githubExpression('github.sha')}`,
    );
    expect(buildJob).toContain('provenance: false');
    expect(buildJob).toContain(
      'cache-to: type=registry,ref=ghcr.io/davidvornholt/portfolio:buildcache,mode=max,image-manifest=true,oci-mediatypes=true',
    );
    expect(buildJob).not.toContain('id-token');
  });

  it('releases only the gated exact commit digest through the queued host action', () => {
    expect(releaseJob).toContain('    needs:\n      - gate\n      - build');
    expect(releaseJob).toContain(
      [
        '    if: >-',
        `      ${canonicalRepository} &&`,
        `      ${mainRef} &&`,
        '      needs.gate.outputs.gated-sha == github.sha\n',
      ].join('\n'),
    );
    expect(releaseJob).toContain(releasePermissions);
    expect(releaseJob).toContain(releaseQueue);
    expect(releaseJob).toContain('          persist-credentials: false');
    expect(releaseJob).toContain(`ref: ${githubExpression('github.sha')}`);
    expect(releaseJob).toContain('uses: ./.github/actions/app-release');
    expect(releaseJob).toContain('          unit: portfolio');
    expect(releaseJob).toContain(knownHost);
    expect(releaseJob).toContain(
      `images: portfolio@${githubExpression('needs.build.outputs.digest')}`,
    );
    expect(releaseJob).not.toContain('buildcache');
  });

  it('moves main only to a digest the host reports as live', () => {
    const moveMain = extractRunScript(
      producer,
      'Point the main tag at the released image',
    );

    expect(releaseJob).toContain(
      "if: steps.release.outputs.result == 'released' || steps.release.outputs.result == 'unchanged'",
    );
    expect(moveMain).toContain(
      'test "$(jq -er .portfolio.digest <<<"$APPS_JSON")" = "$BUILD_DIGEST"',
    );
    expect(moveMain).toContain('test "$resolved" = "$BUILD_DIGEST"');
  });

  it('no longer announces images to an infrastructure repository', () => {
    expect(producer).not.toContain('IMAGE_PROMOTION');
    expect(producer).not.toContain('image-bump');
    expect(producer).not.toContain('create-github-app-token');
  });

  it('rolls back from main of this repository in the same queue as releases', () => {
    expect(rollBack).toContain('name: Roll back');
    expect(rollBack).toContain('on:\n  workflow_dispatch:\n\npermissions: {}');
    expect(rollBack).toContain(
      `\njobs:\n  roll-back:\n    if: ${canonicalRepository} && ${mainRef}\n`,
    );
    expect(rollBack).toContain(releasePermissions);
    expect(rollBack).toContain(releaseQueue);
    expect(rollBack).toContain('          ref: main');
    expect(rollBack).toContain('          command: rollback');
    expect(rollBack).toContain(knownHost);
  });
});
