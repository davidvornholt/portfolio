import { Schema } from 'effect';
import buildInfoData from '../data/build-info.json' with { type: 'json' };

/**
 * The commit a published page was built from. The publishing workflow writes
 * it to `data/build-info.json` before it builds the image. The file that is
 * checked in names no commit, so a local build makes no claim about its own.
 */
// The footer links to the commit by its hash and shows its date, so a file
// with anything else in these two fields fails the build.
const fullSha = /^[0-9a-f]{40}$/u;
const isoDay = /^\d{4}-\d{2}-\d{2}$/u;

const BuildInfo = Schema.Struct({
  sha: Schema.String.check(Schema.isPattern(fullSha)),
  title: Schema.NonEmptyString,
  /** The day the commit was made in Berlin, as `YYYY-MM-DD`. */
  committedOn: Schema.String.check(Schema.isPattern(isoDay)),
  /** False for a preview. */
  released: Schema.Boolean,
});

export type BuildInfo = typeof BuildInfo.Type;

const decodeFile = Schema.decodeUnknownSync(
  Schema.Struct({ commit: Schema.NullOr(BuildInfo) }),
);

export const decodeBuildInfo = (file: unknown): BuildInfo | null =>
  decodeFile(file).commit;

/** Checked when the module loads, so a malformed file fails the build. */
export const buildInfo: BuildInfo | null = decodeBuildInfo(buildInfoData);
