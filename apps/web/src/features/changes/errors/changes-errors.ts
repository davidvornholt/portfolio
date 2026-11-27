import { Schema } from 'effect';

/**
 * A request to GitHub failed or its response had an unexpected shape. The
 * message is printed in a public CI log, so it is built from `operation`,
 * which is fixed text, and from facts such as the HTTP status. It never holds
 * text GitHub sent or anything that identifies a private repository.
 */
export class GitHubRequestError extends Schema.TaggedError<GitHubRequestError>()(
  'GitHubRequestError',
  {
    operation: Schema.String,
    message: Schema.String,
  },
) {}

/**
 * More changes merged within one second than a single search can return, so
 * the window cannot be split further and the data would be incomplete.
 */
export class SearchWindowTooLargeError extends Schema.TaggedError<SearchWindowTooLargeError>()(
  'SearchWindowTooLargeError',
  {
    from: Schema.String,
    count: Schema.Number,
    message: Schema.String,
  },
) {}

/**
 * GitHub answered, but part of what was asked for is missing: an empty entry
 * where a record belongs, a page that is gone, or a list that is not as long
 * as GitHub says it is. The chart would be drawn with a part missing, so the
 * run ends. `subject` names what is incomplete in fixed text, and the message
 * adds nothing but counts, so it is safe to print in a public CI log.
 */
export class IncompleteDataError extends Schema.TaggedError<IncompleteDataError>()(
  'IncompleteDataError',
  {
    subject: Schema.String,
    message: Schema.String,
  },
) {}

export class SnapshotWriteError extends Schema.TaggedError<SnapshotWriteError>()(
  'SnapshotWriteError',
  {
    path: Schema.String,
    message: Schema.String,
  },
) {}
