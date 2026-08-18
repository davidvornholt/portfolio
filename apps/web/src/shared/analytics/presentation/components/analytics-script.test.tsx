import { describe, expect, it } from 'bun:test';
import { AnalyticsScript } from './analytics-script';

// Every way this element breaks is invisible in a browser. A missing
// `data-website-id` leaves Umami answering normally while discarding the events;
// a missing `data-domains` re-enables reporting from development servers and
// preview builds, which corrupts production's numbers rather than emptying them.
// Neither shows up in the a11y sweep, so the rendered attributes are pinned here.
describe('analytics script', () => {
  const rendered = AnalyticsScript();

  it('loads the tracker from the self-hosted installation', () => {
    expect(rendered.props.src).toBe('https://umami.vornholt.online/script.js');
  });

  it('reports against the website ID provisioned in personal-infra', () => {
    expect(rendered.props['data-website-id']).toBe(
      '81f10165-1458-492d-9893-9e04b4e37a17',
    );
  });

  it('scopes reporting to the deployed hostname', () => {
    expect(rendered.props['data-domains']).toBe('david.vornholt.online');
  });
});
