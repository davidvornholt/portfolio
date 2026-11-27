import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { SiteRecord } from './site-record';

const record = {
  repository: 'davidvornholt/portfolio',
  firstMergedOn: '2025-12-23',
  passed: 66,
  unchecked: 5,
  failed: 0,
};

const text = (shown: typeof record): string =>
  renderToStaticMarkup(<SiteRecord record={shown} />);

describe("the record of this site's own repository", () => {
  it('says whose changes it counts, because others merge changes here too', () => {
    expect(text(record)).toContain(
      'None of my 71 changes merged into this site’s project since December 2025 had a failed check. 66 passed, and 5 merged before a check had finished.',
    );
    expect(text({ ...record, passed: 71, unchecked: 0 })).toContain(
      'All 71 of my changes merged into this site’s project since December 2025 passed their checks.',
    );
  });

  it('says nothing once a change merged with a failed check', () => {
    expect(text({ ...record, failed: 1 })).toBe('');
  });
});
