import { expect, test } from '@playwright/test';
import { umamiScriptUrl } from '@/config/analytics';

test('the numbers under the color swatches fit their columns on narrow screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route(`${new URL(umamiScriptUrl).origin}/**`, (route) =>
    route.abort(),
  );
  await page.goto('/posts/mastering-oklch-tailwind-v4');
  await page.evaluate(() => document.fonts.ready);

  const labels = page
    .locator('li')
    .filter({ has: page.locator('[data-slot="color-swatch"]') })
    .locator('p');
  await expect(labels).toHaveCount(30);
  await labels.first().scrollIntoViewIfNeeded();
  const overflowing = await labels.evaluateAll((elements) =>
    elements
      .filter((element) => element.scrollWidth > element.clientWidth)
      .map((element) => element.textContent),
  );
  expect(overflowing).toEqual([]);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});
