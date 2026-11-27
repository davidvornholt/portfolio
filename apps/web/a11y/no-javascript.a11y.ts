import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false });

const routes = ['/', '/posts', '/lab', '/works/atrium'] as const;

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
      await expect(locator).toBeVisible();
    }
  });
}

test('the chart shows its squares and its table without JavaScript', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const squares = page.locator('[data-row="above"] > [data-date] i');
  expect(await squares.count()).toBeGreaterThan(0);
  await expect(squares.last()).toBeVisible();

  await page.getByText('Show the numbers as a table').click();
  await expect(page.getByRole('table')).toBeVisible();
});
