import { expect, test } from '@playwright/test';

// Social card images never show in a browser, so a page can lose its card, or
// render it on request against Google Fonts, without anyone noticing. Every
// page in the sitemap must advertise a card that the build already rendered.
const imageMetaPattern =
  /<meta (?:property="og:image"|name="twitter:image") content="(?<url>[^"]+)"\/>/gu;

test('every sitemap page advertises a prerendered social card image', async ({
  request,
}) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const paths = Array.from(
    sitemap.matchAll(/<loc>(?<url>[^<]+)<\/loc>/gu),
    (match) => new URL(match.groups?.url ?? '').pathname,
  );
  expect(paths).not.toHaveLength(0);

  for (const path of paths) {
    const html = await (await request.get(path)).text();
    const imageUrls = Array.from(
      html.matchAll(imageMetaPattern),
      (match) => new URL(match.groups?.url ?? ''),
    );
    expect(imageUrls, path).toHaveLength(2);

    for (const imageUrl of imageUrls) {
      const image = await request.get(`${imageUrl.pathname}${imageUrl.search}`);
      expect(image.status(), imageUrl.pathname).toBe(200);
      expect(image.headers()['content-type'], imageUrl.pathname).toBe(
        'image/png',
      );
      expect(image.headers()['x-nextjs-cache'], imageUrl.pathname).toBe('HIT');
    }
  }
});
