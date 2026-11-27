import { expect, test } from '@playwright/test';

const scrollTop = (): number => Math.round(globalThis.scrollY);
const articleAddress = /\/posts\/[\w-]+$/u;
// A date, a project and a title: the description has loaded.
const describedMark = /, .+, /u;

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

// Pointing at a link around a group of squares makes one of them hop, and
// another one the next time: a project's row in the ledger, and the changes
// Super Productivity accepted.
for (const [name, link] of [
  ['a project in the ledger', '.project-row'],
  ['Super Productivity', 'a[data-umami-event-project="super-productivity"]'],
] as const) {
  test(`another square of ${name} hops each time it is pointed at`, async ({
    page,
  }) => {
    await page.goto('/');
    const squares = page.locator(link).first();
    const hopping = squares.locator('[data-hop]');
    const placeOfHop = (): Promise<string> =>
      hopping.evaluate((square) => {
        const box = square.getBoundingClientRect();
        return `${Math.round(box.left)} ${Math.round(box.top + globalThis.scrollY)}`;
      });

    await squares.hover();
    await expect(hopping).toHaveCount(1);
    const first = await placeOfHop();

    await page.getByRole('heading', { name: 'My own projects' }).hover();
    await squares.hover();
    await expect(hopping).toHaveCount(1);
    expect(await placeOfHop()).not.toBe(first);
  });
}

// The chart shows 13, 8 or 4 weeks depending on its width, so turning a
// phone or resizing the window lays out other squares. A change pinned in a
// week that stays visible keeps its panel.
test('a pinned change keeps its panel when the chart changes its width', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const stepper = page.getByRole('slider', {
    name: 'Step through the changes one by one',
  });
  const panel = page.locator('.field-panel');
  await stepper.focus();
  for (let step = 0; step < 3; step += 1) {
    await stepper.press('ArrowLeft');
  }
  await expect(panel).toBeVisible();
  // The title arrives with the details, which load once a square is chosen.
  await expect(stepper).toHaveAttribute('aria-valuetext', describedMark);
  const pinned = await stepper.getAttribute('aria-valuetext');

  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(panel).toBeVisible();
    await expect(stepper).toHaveAttribute('aria-valuetext', pinned ?? '');
  }
});
