import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { BuildLine } from './build-line';

const commit = {
  sha: 'd356c99c0ffee0d356c99c0ffee0d356c99c0ffe',
  title: 'chore: ignore direnv cache (#143)',
  committedOn: '2026-11-23',
  released: true,
};

const text = (build: Parameters<typeof BuildLine>[0]['build']): string =>
  renderToStaticMarkup(<BuildLine build={build} />).replace(/<[^>]+>/gu, '');

describe('the footer line about the build', () => {
  it('gives the day a released change merged, and links to its checks', () => {
    const markup = renderToStaticMarkup(<BuildLine build={commit} />);

    expect(text(commit)).toContain(
      'change d356c99, “chore: ignore direnv cache (#143)”, which merged on November 23, 2026 and went live after its checks passed.',
    );
    expect(markup).toContain(
      `href="https://github.com/davidvornholt/portfolio/commit/${commit.sha}/checks"`,
    );
  });

  it('claims no passed checks for a preview', () => {
    const preview = text({ ...commit, released: false });

    expect(preview).toContain('This is a preview');
    expect(preview).not.toContain('checks');
  });

  it('says that a local build comes from a working copy', () => {
    expect(text(null)).toBe(
      'This page was built from a working copy, not from a released change.',
    );
  });
});
