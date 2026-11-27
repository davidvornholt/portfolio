import { describe, expect, it } from 'bun:test';
import { extractRunScript, readWorkflow } from './workflow-test-helpers';

const script = extractRunScript(
  await readWorkflow('roll-back.yml'),
  'Refuse a rollback to the same commit',
);
const liveDigest = `sha256:${'a'.repeat(64)}`;
const previousDigest = `sha256:${'b'.repeat(64)}`;
const newCommit = '1'.repeat(40);
const oldCommit = '2'.repeat(40);

const imageConfig = (revision: string, created: string): string =>
  JSON.stringify({
    created,
    // The OCI image config names its labels field `Labels`.
    config: Object.fromEntries([
      ['Labels', { 'org.opencontainers.image.revision': revision }],
    ]),
  });

type Scenario = {
  readonly live?: string;
  readonly previous?: string | null;
  readonly previousImage?: string;
  readonly sameCommit?: 'true' | 'false';
};

// `docker` stands in for the registry: it answers for the two digests the
// host reports and fails for any other image, as a deleted one would.
const runCheck = ({
  live = imageConfig(newCommit, '2026-11-24T04:20:00Z'),
  previous = previousDigest,
  previousImage = imageConfig(newCommit, '2026-11-23T04:20:00Z'),
  sameCommit = 'false',
}: Scenario = {}) =>
  globalThis.Bun.spawnSync(
    [
      'bash',
      '-c',
      `
docker() {
  case "$4" in
    "$IMAGE@${liveDigest}") printf '%s' "$TEST_LIVE" ;;
    "$IMAGE@${previousDigest}") printf '%s' "$TEST_PREVIOUS" ;;
    *) return 1 ;;
  esac
}
${script}
`,
    ],
    {
      env: {
        ...globalThis.Bun.env,
        ...Object.fromEntries([
          [
            'APPS_JSON',
            JSON.stringify({
              portfolio: {
                repository: 'ghcr.io/davidvornholt/portfolio',
                digest: liveDigest,
                previousDigest: previous,
                slot: 'blue',
              },
            }),
          ],
          ['IMAGE', 'ghcr.io/davidvornholt/portfolio'],
          ['SAME_COMMIT', sameCommit],
          ['TEST_LIVE', live],
          ['TEST_PREVIOUS', previousImage],
        ]),
      },
    },
  );

describe('roll back to the same commit', () => {
  it('refuses when the previous release is a daily build of the live commit', () => {
    const result = runCheck();
    const stdout = result.stdout.toString();
    expect(result.exitCode).toBe(1);
    expect(stdout).toContain(
      `::error::The release before the current one is the same commit, ${newCommit}, built 2026-11-23`,
    );
    expect(stdout).toContain('revert it on main');
  });

  it('goes ahead for the same commit when same-commit is set', () => {
    const result = runCheck({ sameCommit: 'true' });
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString()).toContain(
      'from the build of 2026-11-24 to the build of 2026-11-23',
    );
  });

  it('goes ahead when the previous release is an earlier commit', () => {
    const result = runCheck({
      previousImage: imageConfig(oldCommit, '2026-11-20T09:00:00Z'),
    });
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString()).toContain(
      `::notice::Rolling back from commit ${newCommit}, built 2026-11-24, to commit ${oldCommit}, built 2026-11-20`,
    );
  });

  it('goes ahead with a warning when the registry no longer has an image', () => {
    const result = runCheck({ previousImage: '' });
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString()).toContain('::warning::');
  });

  it('leaves the host to report that there is no previous release', () => {
    const result = runCheck({ previous: null });
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString()).toContain(
      '::notice::The host reports no release before the current one',
    );
  });
});
