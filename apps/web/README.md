# @portfolio/web

Setup and operations are in the [repository README](../../README.md).

To refresh the home page record, run `bun run fetch:activity` in this workspace with Python 3.11 or later and a read-only `GITHUB_TOKEN` covering the author's personal and organization repositories, including private pull requests, checks, and commit statuses. The fetcher queries GitHub once per page of results and replaces the snapshot only after validating every page. Run the root gate before committing the snapshot.
