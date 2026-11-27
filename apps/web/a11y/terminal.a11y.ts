import { scanWcag22AaViolations } from '@davidvornholt/a11y-testing/axe';
import { expect, test } from '@playwright/test';

// The terminal on the home page takes a few commands from a visitor who
// clicks into it. Undoing the agent's change makes the check pass. A phone
// gets no prompt, so this runs on the desktop only.
test('the terminal passes the check once the visitor has restored the rule', async ({
  page,
}) => {
  await page.goto('/');
  const terminal = page.locator('#rules .terminal');
  const prompt = terminal.getByLabel('Command for the terminal');
  const height = async (): Promise<number> =>
    Math.round((await terminal.boundingBox())?.height ?? 0);

  await terminal.scrollIntoViewIfNeeded();
  await terminal.getByText('An agent "loosens" a rule').click();
  await expect(prompt).toBeFocused();
  const heightAtRest = await height();

  await prompt.fill('bun standards sync');
  await prompt.press('Enter');
  await prompt.fill('bun standards check');
  await prompt.press('Enter');

  await expect(
    terminal.getByText(
      'standards: 64 canonical path(s) match the last synced state',
    ),
  ).toBeInViewport();
  expect(await height()).toBe(heightAtRest);
  expect(await scanWcag22AaViolations(page)).toEqual([]);
});
