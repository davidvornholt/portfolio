import { scanWcag22AaViolations } from '@davidvornholt/a11y-testing/axe';
import { expect, test } from '@playwright/test';
import { umamiScriptUrl } from '@/config/analytics';

const routes = [
  { name: 'home', path: '/' },
  { name: 'lab', path: '/lab' },
  {
    name: 'architect portfolio post',
    path: '/posts/building-the-architects-portfolio',
  },
  {
    name: 'cold boot post',
    path: '/posts/solving-the-cold-boot-problem',
  },
  {
    name: 'OKLCH post',
    path: '/posts/mastering-oklch-tailwind-v4',
  },
  {
    name: 'review-fix comparison post',
    path: '/posts/review-fix-versus-coderabbit',
  },
  {
    name: 'review-loop failure post',
    path: '/posts/review-loop-ran-for-46-hours',
  },
  { name: 'FES Kirchheim case study', path: '/works/fes-kirchheim' },
  { name: 'Atrium case study', path: '/works/atrium' },
  { name: 'ProsaBridge case study', path: '/works/prosabridge' },
] as const;

// The tracker loads in every environment, so this suite now reaches the
// analytics host on every navigation. That host is outside the test's control:
// if it stops answering rather than refusing, each `page.goto` blocks until the
// navigation timeout and the accessibility gate fails for a reason that has
// nothing to do with accessibility. No assertion here depends on the tracker, so
// the request is refused outright and the suite stays hermetic.
test.beforeEach(async ({ page }) => {
  await page.route(`${new URL(umamiScriptUrl).origin}/**`, (route) =>
    route.abort(),
  );
});

const waitForFiniteAnimations = async (
  page: Parameters<typeof scanWcag22AaViolations>[0],
): Promise<void> => {
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => {
      const iterations = animation.effect?.getTiming().iterations;
      return (
        iterations === Number.POSITIVE_INFINITY ||
        animation.playState !== 'running'
      );
    }),
  );
};

test('reduced motion disables scripted animations and smooth scrolling', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await waitForFiniteAnimations(page);

  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
  await expect
    .poll(() =>
      page.evaluate(() =>
        document
          .getAnimations()
          .some((animation) => animation.playState === 'running'),
      ),
    )
    .toBe(false);
});

test('color comparison renders distinct, non-transparent swatches', async ({
  page,
}) => {
  await page.goto('/posts/mastering-oklch-tailwind-v4');

  const swatches = page.locator('[data-slot="color-swatch"]');
  await expect(swatches).toHaveCount(10);

  const backgroundColors = await swatches.evaluateAll((nodes) =>
    nodes.map((node) => getComputedStyle(node).backgroundColor),
  );

  expect(
    backgroundColors.every(
      (backgroundColor) =>
        backgroundColor !== 'rgba(0, 0, 0, 0)' &&
        backgroundColor !== 'transparent',
    ),
  ).toBe(true);
  expect(backgroundColors[0]).not.toBe(backgroundColors[5]);
});

for (const route of routes) {
  test(`${route.name} has no automated WCAG 2.2 AA violations`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route.path);

    await expect(page.locator('main')).toBeVisible();
    await waitForFiniteAnimations(page);
    expect(await scanWcag22AaViolations(page)).toEqual([]);
  });
}
