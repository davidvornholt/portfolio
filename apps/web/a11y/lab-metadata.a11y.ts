import { expect, test } from '@playwright/test';

// The lab is reachable by direct link but stays out of search results. Link
// previews and crawlers read the served HTML without running scripts, so these
// checks read it the same way.
const labPath = '/lab';

const canonicalPattern = /<link rel="canonical" href="(?<value>[^"]+)"\/>/u;
const openGraphUrlPattern =
  /<meta property="og:url" content="(?<value>[^"]+)"\/>/u;
const openGraphTitlePattern =
  /<meta property="og:title" content="(?<value>[^"]+)"\/>/u;
const twitterTitlePattern =
  /<meta name="twitter:title" content="(?<value>[^"]+)"\/>/u;
const robotsPattern = /<meta name="robots" content="(?<value>[^"]+)"\/>/u;
const imagePattern =
  /<meta (?:property="og:image"|name="twitter:image") content="(?<value>[^"]+)"\/>/gu;
const disallowPattern = /^Disallow:[ \t]*(?<path>\S*)/gimu;
const sitemapLocationPattern = /<loc>(?<url>[^<]+)<\/loc>/gu;

const headValue = (html: string, pattern: RegExp): string | undefined =>
  pattern.exec(html)?.groups?.value;

test('the lab page names, links, and pictures itself when shared', async ({
  request,
}) => {
  const html = await (await request.get(labPath)).text();

  expect(new URL(headValue(html, canonicalPattern) ?? '').pathname).toBe(
    labPath,
  );
  expect(new URL(headValue(html, openGraphUrlPattern) ?? '').pathname).toBe(
    labPath,
  );
  expect(headValue(html, openGraphTitlePattern)).toBe('The creative lab');
  expect(headValue(html, twitterTitlePattern)).toBe('The creative lab');

  const imageUrls = Array.from(
    html.matchAll(imagePattern),
    (match) => new URL(match.groups?.value ?? ''),
  );
  expect(imageUrls).toHaveLength(2);
  for (const imageUrl of imageUrls) {
    const image = await request.get(`${imageUrl.pathname}${imageUrl.search}`);
    expect(image.status(), imageUrl.pathname).toBe(200);
    expect(image.headers()['content-type'], imageUrl.pathname).toBe(
      'image/png',
    );
  }
});

test('the lab page asks search engines not to index it', async ({
  request,
}) => {
  const html = await (await request.get(labPath)).text();

  expect(headValue(html, robotsPattern)).toContain('noindex');
});

// A crawler that robots.txt keeps out of the page never reads its `noindex`,
// and can still index the bare URL from links elsewhere.
test('robots.txt lets crawlers fetch the lab page', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  const disallowedPrefixes = Array.from(
    robots.matchAll(disallowPattern),
    (match) => match.groups?.path ?? '',
  ).filter((path) => path !== '');

  for (const prefix of disallowedPrefixes) {
    expect(labPath.startsWith(prefix), `Disallow: ${prefix}`).toBe(false);
  }
});

test('the sitemap leaves out the lab page', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const paths = Array.from(
    sitemap.matchAll(sitemapLocationPattern),
    (match) => new URL(match.groups?.url ?? '').pathname,
  );

  expect(paths).not.toHaveLength(0);
  expect(paths.filter((path) => path.startsWith(labPath))).toEqual([]);
});
