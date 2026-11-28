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

/**
 * The tokens and owners the run was given don't cover what it has to read: a
 * list has an empty or repeated entry, the tokens don't match the owners, or
 * a token doesn't read every repository of its owner. Each of these would
 * leave an owner's private changes out of a chart that looks whole, so the
 * run ends before it fetches anything. The message can name an owner, which
 * the public workflow names too. It never holds a token, the name of a
 * repository or text GitHub sent.
 */
export class TokenCoverageError extends Schema.TaggedError<TokenCoverageError>()(
  'TokenCoverageError',
  {
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

/**
 * The record of verdicts on the site's own changes could not be read or
 * written, or it doesn't hold what its schema names.
 */
export class SiteVerdictsFileError extends Schema.TaggedError<SiteVerdictsFileError>()(
  'SiteVerdictsFileError',
  {
    path: Schema.String,
    message: Schema.String,
  },
) {}

/**
 * A change of the site's own repository is old enough that GitHub may soon
 * delete, or has deleted, its checks, and the committed record has no verdict
 * for it. Judged without its checks it would change the site's record, so the
 * run ends until the verdict is recorded. `numbers` are pull request numbers
 * of the public repository.
 */
export class SiteVerdictMissingError extends Schema.TaggedError<SiteVerdictMissingError>()(
  'SiteVerdictMissingError',
  {
    numbers: Schema.Array(Schema.Int),
    message: Schema.String,
  },
) {}
