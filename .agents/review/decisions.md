# Review decisions registry

Durable, already-litigated review decisions. How reviewers must treat entries and when orchestrators append them is defined in the `review` and `review-fix` skills.

Entry format: heading `### D-NNN (date, status) — title`, where status is `decided` or `open`, followed by the decision and its rationale in prose. Entries are never edited silently; superseding an entry means a new entry that references the old id.

## Entries

### D-001 (2026-08-18, decided) — Umami's `data-domains` replaces the deleted "analytics off" switch

PR #32 removed the conditional that hid the tracker when no website ID was supplied, so the script now loads in every environment. Hostname scoping is what keeps development servers, CI runs, and preview builds out of production's numbers, and it is accepted as sufficient.

The premise is that `data-domains` is a comma-delimited list of bare hostnames matched against `window.location.hostname`, and that `david.vornholt.online` is the only hostname a visitor can arrive on: the zone apex `vornholt.online` is a permanent redirect rather than a served alias, and no `www` record exists. Verified three ways: against Umami's tracker documentation; against the tracker source extracted from the exact image digest `personal-infra` pins (Umami 3.3.0), whose send gate refuses when `data-domains` is present and does not contain `location.hostname`; and against `personal-infra`'s `infra/modules/apps/portfolio.nix` and `infra/opentofu/cloudflare-dns/records.tf` for the hostname claim.

This premise drifts, and the decision reopens, if the site is ever served on a second hostname — a `www` record, a staging alias, or a custom domain — because the tracker would then silently report nothing from it. Adding a hostname means adding it to `data-domains`.

Accepted cost: the script is still fetched from the production analytics host by every development server and every CI a11y run. Only the reporting is suppressed, not the request.

### D-002 (2026-08-18, decided) — The Umami website ID and script URL are configuration, not secrets

Both values are served in the HTML of every page and grant no access to the Umami dashboard, so under AGENTS.md's test — a value is secret if leaking it enables impersonation, data access, or cost — they are configuration and belong in tracked source next to `siteUrl`. Their previous life as build-time environment variables is what kept analytics dark: nothing ever supplied them.

The premise is that possession of the website ID confers no ability to read the dashboard, and that writing events to a known ID is not a cost or integrity concern worth defending for a personal portfolio. If Umami's threat model ever changes so that a website ID enables reading data, or if event-injection becomes material, this reopens.

### D-003 (2026-08-18, decided) — The analytics tests pin literal values deliberately

AGENTS.md prohibits tests that only pin static literals. The assertions in `apps/web/src/config/analytics.test.ts` and `apps/web/src/shared/analytics/presentation/components/analytics-script.test.tsx` pin literals anyway, and that is the point: the website ID and tracked domain are one contract with the `personal-infra` repository, which provisions the matching Umami website row. Drift fails silently — Umami answers normally and discards the events — and no runtime, deploy, or a11y check observes it.

The premise is that these tests are change-detectors on a cross-repository contract, not assertions about local implementation detail. They earn their place by forcing a deliberate second edit that points at the other repository. If the contract is ever made mechanically verifiable end to end — for example a post-promotion probe in `personal-infra` that confirms an event posted with this website ID is persisted — these assertions become redundant and should be replaced by it.
