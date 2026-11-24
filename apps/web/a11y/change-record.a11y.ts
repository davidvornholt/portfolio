import { scanWcag22AaViolations } from '@davidvornholt/a11y-testing/axe';
import { expect, test } from '@playwright/test';

test('a reader can inspect the record, weekly totals, and a review stage', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const chart = page.getByRole('slider');
  await chart.focus();
  await chart.press('Home');
  await expect(chart).toHaveAttribute('aria-valuenow', '1');
  await chart.press('ArrowRight');
  await expect(chart).toHaveAttribute('aria-valuenow', '2');
  await page
    .locator('summary:visible')
    .filter({ hasText: 'Show these numbers as a table' })
    .click();
  await expect(page.getByRole('table')).toBeVisible();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Inspect the repair' }),
  ).toBeVisible();
  await page.getByText('Inspect five rules that protect this site').click();
  expect(await scanWcag22AaViolations(page)).toEqual([]);
});
for (const path of [
  '/posts/reading-my-change-record',
  '/missing-portfolio-page',
]) {
  test(`scans the published page at ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    expect(await scanWcag22AaViolations(page)).toEqual([]);
  });
}
