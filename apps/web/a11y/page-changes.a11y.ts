import { expect, test } from '@playwright/test';

const scrollTop = (): number => Math.round(globalThis.scrollY);
const articleAddress = /\/posts\/[\w-]+$/u;

// The site scrolls smoothly to a section when its link is clicked. A new
// page must not inherit that: it starts at its top, and the back button
// returns to the place the visitor left without scrolling there from the top.
test('an article opens at its top and the back button returns to the list at once', async ({
  page,
}) => {
  await page.goto('/');
  const writing = page.locator('#writing');
  await writing.evaluate((section) =>
    section.scrollIntoView({ behavior: 'instant' }),
  );
  const leftAt = await page.evaluate(scrollTop);
  expect(leftAt).toBeGreaterThan(0);

  await writing.getByRole('link').first().click();
  await expect(page).toHaveURL(articleAddress);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  expect(await page.evaluate(scrollTop)).toBe(0);

  await page.goBack();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
  await expect.poll(() => page.evaluate(scrollTop)).toBe(leftAt);
});

// Pointing at a project's row makes one square of its chart hop, and another
// one the next time.
test('another square of a project hops each time its row is pointed at', async ({
  page,
}) => {
  await page.goto('/');
  const row = page.locator('.project-row').first();
  const hopping = row.locator('[data-hop]');
  const placeOfHop = (): Promise<string> =>
    hopping.evaluate(
      (square) => `${square.getAttribute('x')} ${square.getAttribute('y')}`,
    );

  await row.hover();
  await expect(hopping).toHaveCount(1);
  const first = await placeOfHop();

  await page.getByRole('heading', { name: 'My own projects' }).hover();
  await row.hover();
  await expect(hopping).toHaveCount(1);
  expect(await placeOfHop()).not.toBe(first);
});
