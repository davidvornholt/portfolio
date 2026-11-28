# Portfolio

David Vornholt’s portfolio and blog.

## Development

Use the Bun version in `package.json`:

```sh
bun install
bun run dev
```

Run `bun run check:fix` for the full quality gate. Add case studies in `apps/web/src/features/works/content/` and posts in `apps/web/src/features/posts/content/`.

Site and analytics configuration lives in `apps/web/src/config/`. The Umami website ID and domain must match `infra/modules/apps/umami.nix` in personal-infra; a mismatch silently discards events. These values are compiled into the image, so changes require a rebuild.

The chart on the home page is drawn from `apps/web/src/features/changes/data/changes.json`. The committed copy is what development and PR previews show. Refresh it with `CHANGES_GITHUB_TOKENS="$(gh auth token)" CHANGES_OWNERS=<owners> CHANGES_SITE_VERDICTS=record bun run --cwd apps/web changes:fetch`, which takes a few minutes. `<owners>` is the list `publish-container.yml` passes: the accounts and organisations whose repositories are David’s own.

The refresh also adds the verdict of each new change of this repository to `apps/web/src/features/changes/data/site-verdicts.json`, so the site’s own record keeps its verdicts after GitHub deletes their checks, about 410 days after they ran. The production fetch only reads that file, and it fails once a change older than 300 days has no entry there: then run the refresh and commit both files.

## Deployment

[personal-infra](https://github.com/davidvornholt/personal-infra) owns the host, configuration, and secrets for production at `https://david.vornholt.online`. Merging to `main` deploys: once Standards passes on the merge commit, the Publish container workflow releases that exact image to production. To return to the release before the current one, run the Roll back workflow; running it again returns to the newer release. After a daily publish the release before the current one is the same commit with the data of the day before, so Roll back refuses to run unless you tick `same-commit`, which returns only that data. It also refuses when the registry can't tell which commit an image was built from. To undo a code change after a daily publish, revert it on `main`.

A production publish fetches the chart data again. That happens on a push to `main` and once a day, when the schedule starts Publish container on `main` again. It reads the data with read-only tokens it mints from the App in `ci.changes_app`, described in `secrets/ci.example.yaml`. A failed fetch fails the run, and production keeps the release it has. Pull request builds use the committed snapshot.

Label a same-repository, non-draft PR `pr-preview` to request `https://<number>.pr.david.vornholt.online`; removing the label tears it down. After a change to `publish-container.yml`, `standards.yml` or a `pr-preview-*.yml` workflow lands on `main`, an open PR has to bring its workflow files up to date with `main` before its preview can update.

## License

The code is under the [MIT license](LICENSE). The posts, case studies and portrait are © David Vornholt, all rights reserved.
