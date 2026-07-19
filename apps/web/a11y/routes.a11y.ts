import { scanWcag22AaViolations } from '@davidvornholt/a11y-testing/axe';
import { expect, test } from '@playwright/test';

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
  { name: 'FES Kirchheim case study', path: '/works/fes-kirchheim' },
] as const;

const waitForFiniteAnimations = async (
  page: Parameters<typeof scanWcag22AaViolations>[0],
): Promise<void> => {
  await page.waitForFunction(() => document.getAnimations().length > 0);
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
