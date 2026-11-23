import { Schema } from 'effect';
import buildInfoData from '../data/build-info.json' with { type: 'json' };

/**
 * The commit a published page was built from. The publishing workflow writes
 * it to `data/build-info.json` before it builds the image. The file that is
 * checked in holds `null`, so a local build makes no claim about its commit.
 */
const BuildInfo = Schema.Struct({
  sha: Schema.NonEmptyString,
  title: Schema.NonEmptyString,
  /** The commit's date as `YYYY-MM-DD`. */
  committedOn: Schema.NonEmptyString,
  /** False for a preview, which is built before its checks have finished. */
  released: Schema.Boolean,
});

export type BuildInfo = typeof BuildInfo.Type;

export const decodeBuildInfo = Schema.decodeUnknownSync(
  Schema.NullOr(BuildInfo),
);

/** Checked when the module loads, so a malformed file fails the build. */
export const buildInfo: BuildInfo | null = decodeBuildInfo(buildInfoData);
