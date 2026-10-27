import { expect, test } from '@playwright/test';

// Entrance animations render their hidden starting frame on the server, and
// only the client script plays them. Visitors without JavaScript must still
// see the page. Playwright treats `opacity: 0` as visible, so the check reads
// the opacity the element ends up with after its ancestors are applied.
test.use({ javaScriptEnabled: false });

const routes = ['/', '/posts', '/lab', '/works/atrium'] as const;

const renderedOpacity = (element: Element): number => {
  let opacity = 1;
  for (
    let current: Element | null = element;
    current !== null;
    current = current.parentElement
  ) {
    opacity *= Number(getComputedStyle(current).opacity);
  }
  return opacity;
};

for (const path of routes) {
  test(`${path} shows its header, heading and footer without JavaScript`, async ({
    page,
  }) => {
    await page.goto(path);

    for (const locator of [
      page.getByRole('banner').first(),
      page.getByRole('heading', { level: 1 }),
      page.getByRole('contentinfo'),
    ]) {
      expect(await locator.evaluate(renderedOpacity)).toBe(1);
    }
  });
}
