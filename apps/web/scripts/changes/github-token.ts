import { Context, type Redacted } from 'effect';

/**
 * One token that reads the data. A token reaches the private repositories of
 * a single owner, so the fetch runs once for each token it is given.
 */
export class GitHubToken extends Context.Service<
  GitHubToken,
  Redacted.Redacted
>()('portfolio/web/scripts/changes/GitHubToken') {}
