import { describe, expect, it } from 'bun:test';
import {
  umamiScriptUrl,
  umamiTrackedDomain,
  umamiWebsiteId,
} from './analytics';

// These assertions pin literals on purpose. The website ID and the tracked
// domain are one contract with the `personal-infra` repository, which provisions
// the matching Umami website row from `infra/modules/apps/umami.nix` (`websiteId`
// and `websiteDomain`). Drift between the two repositories fails silently: Umami
// answers every request normally and discards the events. Requiring a deliberate
// second edit here is the only signal this repository can give.
describe('analytics configuration', () => {
  it('identifies the site with the website ID provisioned in personal-infra', () => {
    expect(umamiWebsiteId).toBe('81f10165-1458-492d-9893-9e04b4e37a17');
  });

  it('scopes the tracker to the provisioned domain so other hosts report nothing', () => {
    expect(umamiTrackedDomain).toBe('david.vornholt.online');
  });

  it('loads the tracker from the self-hosted installation over HTTPS', () => {
    const url = new URL(umamiScriptUrl);

    expect(url.protocol).toBe('https:');
    expect(url.hostname).toBe('umami.vornholt.online');
  });
});
