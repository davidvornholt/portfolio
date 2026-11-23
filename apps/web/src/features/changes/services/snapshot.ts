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
 * Everything the page knows about merged changes: one entry per calendar day
 * in Germany, oldest first, ending with the day the data was fetched.
 */
export const Snapshot = Schema.Struct({
  updatedOn: IsoDay,
  days: Schema.NonEmptyArray(Day),
});

export type Snapshot = typeof Snapshot.Type;
export type SnapshotDay = typeof Day.Type;
export type SnapshotChange = typeof Change.Type;
export type SnapshotAttempt = typeof SentBackAttempt.Type;
