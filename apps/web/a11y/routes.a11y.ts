import { scanWcag22AaViolations } from '@davidvornholt/a11y-testing/axe';
import { expect, test } from '@playwright/test';
import { umamiScriptUrl } from '@/config/analytics';

const routes = [
  { name: 'home', path: '/' },
  { name: 'lab', path: '/lab' },
  { name: 'posts archive', path: '/posts' },
  {
    name: 'executable engineering standards post',
    path: '/posts/executable-engineering-standards',
  },
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
  {
    name: 'AI review cost study post',
    path: '/posts/cheap-ai-code-reviews',
  },
  { name: 'FES Kirchheim case study', path: '/works/fes-kirchheim' },
  { name: 'Atrium case study', path: '/works/atrium' },
  { name: 'ProsaBridge case study', path: '/works/prosabridge' },
  { name: 'legal notice', path: '/impressum' },
  { name: 'privacy notice', path: '/privacy' },
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
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
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

test('code snippet headers fit a 320 CSS pixel viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/posts/building-the-architects-portfolio');
  await page.evaluate(() => document.fonts.ready);

  const title = page.getByText('features/works/content/work-meta.ts', {
    exact: true,
  });
  await title.scrollIntoViewIfNeeded();
  await expect(title).toBeVisible();
  await expect(page.getByText('typescript', { exact: true })).toBeInViewport({
    ratio: 1,
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});

test('footer section links reach the home page sections from other routes', async ({
  page,
}) => {
  await page.goto('/posts');
  await page
    .getByRole('contentinfo')
    .getByRole('link', { name: 'Work', exact: true })
    .click();

  await expect(page).toHaveURL(
    (url) => url.pathname === '/' && url.hash === '#work',
  );
  await expect(page.locator('#work')).toBeInViewport();
});

// German law requires the legal notice to be reachable from every page, and
// the footer is the one element every route renders.
test('footer links reach the legal notice and privacy notice', async ({
  page,
}) => {
  for (const [label, heading] of [
    ['Impressum', 'Legal notice'],
    ['Privacy', 'Privacy notice'],
  ] as const) {
    await page.goto('/posts');
    await page
      .getByRole('navigation', { name: 'Legal' })
      .getByRole('link', { name: label })
      .click();
    await expect(
      page.getByRole('heading', { level: 1, name: heading }),
    ).toBeVisible();
  }
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

// What the chart says about a change ends with one of its four verdicts.
const describedChangePattern =
  /, (?:Its checks had passed|It went live with a failed check|No check had run|Sent back by the checks)$/u;

// The chart's two further states: its numbers as a table, and one change
// picked out and described.
test('the chart opens its numbers as a table without violations', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByText('Show the numbers as a table').click();

  await expect(page.getByRole('table')).toBeVisible();
  await expect(
    page.getByRole('rowheader', { name: 'All thirteen weeks' }),
  ).toBeVisible();
  expect(await scanWcag22AaViolations(page)).toEqual([]);
});

test('the keyboard steps through the chart and each change is described', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const stepper = page.getByRole('slider', {
    name: 'Step through the changes one by one',
  });
  // The stepper covers the squares once the page has measured them.
  await expect(stepper).not.toHaveAttribute('max', '0');
  await stepper.focus();
  const latest = await stepper.inputValue();
  await stepper.press('ArrowLeft');

  await expect(stepper).not.toHaveValue(latest);
  // The description arrives with the details, which load on first use.
  await expect(stepper).toHaveAttribute(
    'aria-valuetext',
    describedChangePattern,
  );
  await expect(
    page.getByRole('button', { name: 'Previous change' }),
  ).toBeVisible();
  expect(await scanWcag22AaViolations(page)).toEqual([]);

  await stepper.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Previous change' }),
  ).toBeHidden();
});

// The section that follows one change holds still while the visitor scrolls
// and shows its six steps one at a time. With reduced motion it is a list.
test('the path of one change shows one step at a time while scrolling', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.locator('#how');
  const steps = section.getByRole('listitem');
  const fourthStep = steps.filter({ hasText: 'Reviewers try to break it' });
  const thirdStep = steps.filter({ hasText: 'Every check has to pass' });
  // The middle of the fourth step's share of the scrolling distance.
  const fourthStepProgress = 0.58;

  await section.evaluate((element, progress) => {
    const top = element.getBoundingClientRect().top + window.scrollY;
    const distance = element.clientHeight - window.innerHeight;
    window.scrollTo(0, top + distance * progress);
  }, fourthStepProgress);

  await expect(fourthStep).toHaveCSS('opacity', '1');
  await expect(thirdStep).toHaveCSS('opacity', '0');
  expect(await scanWcag22AaViolations(page)).toEqual([]);
});

test('the path of one change is a list of six steps with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const steps = page.locator('#how').getByRole('listitem');
  const stepCount = 6;

  await expect(steps).toHaveCount(stepCount);
  for (const step of await steps.all()) {
    await expect(step).toHaveCSS('opacity', '1');
  }
});
