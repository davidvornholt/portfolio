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

## Deployment

[personal-infra](https://github.com/davidvornholt/personal-infra) owns production at `https://david.vornholt.online`. Label a same-repository, non-draft PR `pr-preview` to request `https://<number>.pr.david.vornholt.online`; removing the label tears it down.
