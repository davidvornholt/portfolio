import { Schema } from 'effect';

/**
 * A request to GitHub failed or its response had an unexpected shape.
 * `operation` names the request without repository names, so the message is
 * safe to print in a public CI log.
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

export class SnapshotWriteError extends Schema.TaggedError<SnapshotWriteError>()(
  'SnapshotWriteError',
  {
    path: Schema.String,
    message: Schema.String,
  },
) {}
