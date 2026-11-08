import { expect, test } from '@playwright/test';
import { umamiScriptUrl } from '@/config/analytics';

test('expanded swatch notes fit their columns on narrow screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route(`${new URL(umamiScriptUrl).origin}/**`, (route) =>
    route.abort(),
  );
  await page.goto('/posts/mastering-oklch-tailwind-v4');
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('button', { name: 'Show notes' }).click();

  const notes = page.getByText('Uniform brightness', { exact: true });
  await expect(notes).toHaveCount(5);
  await notes.first().scrollIntoViewIfNeeded();
  const widths = await notes.evaluateAll((elements) =>
    elements.map((element) => {
      const card = element.parentElement?.parentElement;
      if (card === null || card === undefined) {
        throw new Error('The note must belong to a swatch card.');
      }
      return {
        note: element.getBoundingClientRect().width,
        card: card.getBoundingClientRect().width,
      };
    }),
  );
  for (const width of widths) {
    expect(width.note).toBeLessThanOrEqual(width.card);
  }
});
