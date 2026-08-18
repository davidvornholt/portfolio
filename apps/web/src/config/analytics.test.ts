import { describe, expect, it } from 'bun:test';
import {
  umamiScriptUrl,
  umamiTrackedDomain,
  umamiWebsiteId,
} from './analytics';
import { siteUrl } from './site';

const lowercaseUuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u;

describe('analytics configuration', () => {
  it('scopes the tracker to the deployed site so other hosts report nothing', () => {
    expect(umamiTrackedDomain).toBe(new URL(siteUrl).hostname);
  });

  it('loads the tracker from the self-hosted installation over HTTPS', () => {
    const url = new URL(umamiScriptUrl);

    expect(url.protocol).toBe('https:');
    expect(url.hostname).toBe('umami.vornholt.online');
  });

  it('identifies the site with the website ID provisioned on the host', () => {
    expect(umamiWebsiteId).toMatch(lowercaseUuid);
  });
});
