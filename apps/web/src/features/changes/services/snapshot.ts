import { Schema } from 'effect';

const isoDayPattern = /^\d{4}-\d{2}-\d{2}$/u;

const IsoDay = Schema.String.check(Schema.isPattern(isoDayPattern));

/** What the page may show of a change in a public repository. */
const PublicSource = Schema.Struct({
  repository: Schema.String,
  number: Schema.Int,
  title: Schema.String,
  url: Schema.String,
  failedChecks: Schema.Array(Schema.String),
});

const PublicChange = Schema.Struct({
  verdict: Schema.Literals(['passed', 'failed', 'unchecked']),
  linesChanged: Schema.Int,
  source: PublicSource,
});

/**
 * A change in a private repository. Only passed ones are published, and of
 * those only the size: the day comes from the `Day` that holds the change.
 */
const PrivateChange = Schema.Struct({
  verdict: Schema.Literal('passed'),
  linesChanged: Schema.Int,
  source: Schema.Null,
});

const Change = Schema.Union([PublicChange, PrivateChange]);

/** A check run that failed on a pull request before the pull request merged. */
const SentBackAttempt = Schema.Struct({
  source: Schema.NullOr(
    Schema.Struct({
      repository: Schema.String,
      workflow: Schema.String,
      title: Schema.String,
      url: Schema.String,
    }),
  ),
});

const Day = Schema.Struct({
  date: IsoDay,
  /** In the order the changes merged. */
  changes: Schema.Array(Change),
  /** In the order the runs started. */
  sentBack: Schema.Array(SentBackAttempt),
});

/**
 * What the checks said about every change merged into this site's own
 * repository since its first one.
 */
const SiteRecord = Schema.Struct({
  repository: Schema.String,
  firstMergedOn: IsoDay,
  passed: Schema.Int,
  failed: Schema.Int,
  unchecked: Schema.Int,
});

/** Changes merged into a public project that David does not maintain. */
const AcceptedProject = Schema.Struct({
  repository: Schema.String,
  changes: Schema.Int,
});

/**
 * Everything the page knows about merged changes. `days` has one entry per
 * calendar day in Germany, oldest first, ending with the day the data was
 * fetched. `site` and `elsewhere` reach back to the first change.
 */
const Snapshot = Schema.Struct({
  updatedOn: IsoDay,
  days: Schema.NonEmptyArray(Day),
  site: SiteRecord,
  elsewhere: Schema.Array(AcceptedProject),
});

// A property the schema does not name fails the check. By default it would
// only be left out of the decoded value, and the browser reads the file
// itself (`field-explorer.tsx`), where the property would still be there.
const exact = { onExcessProperty: 'error' } as const;
const decode = Schema.decodeUnknownSync(Snapshot);
const encode = Schema.encodeSync(Snapshot);

/**
 * The snapshot in `raw`, the parsed content of the snapshot file. Throws
 * unless `raw` holds what the schema names and nothing else.
 */
export const decodeSnapshot = (raw: unknown): Snapshot => decode(raw, exact);

/**
 * What the snapshot file holds for `snapshot`. Throws on anything
 * `decodeSnapshot` would not accept, so a file that cannot be read back is
 * never written.
 */
export const encodeSnapshot = (snapshot: Snapshot): typeof Snapshot.Encoded =>
  encode(snapshot, exact);

export type Snapshot = typeof Snapshot.Type;
export type SnapshotDay = typeof Day.Type;
export type SnapshotChange = typeof Change.Type;
export type SnapshotAttempt = typeof SentBackAttempt.Type;
export type SnapshotSiteRecord = typeof SiteRecord.Type;
export type SnapshotAcceptedProject = typeof AcceptedProject.Type;
