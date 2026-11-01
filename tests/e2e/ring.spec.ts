import { expect, test } from '@playwright/test';
import { answer, arrive, correct, fresh, next, noHorizontalScroll, setCode } from './helpers';

test.beforeEach(async ({ page }) => {
  await fresh(page, '/en/play/neckar-ring');
});

test('The Neckar Ring in expert mode: interrogation, torn strips, cipher wheel, the twist and three endings', async ({ page }) => {
  test.setTimeout(300_000);
  await page.getByRole('radio', { name: /Expert/ }).check({ force: true });
  await page.getByRole('button', { name: 'Start the adventure' }).click();

  // 1. The box: a cutscene that can be skipped, the pursuer far away, the timer always on
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Locked Box');
  const skip = page.getByRole('button', { name: /Skip/ });
  if (await skip.count()) await skip.click();
  await expect(page.getByText('far away')).toBeVisible();
  await expect(page.getByRole('button', { name: /Hide timer/ })).toBeVisible();
  await arrive(page);
  await expect(page.getByText('Expert mode: no hints.', { exact: false })).toBeVisible();
  await setCode(page, '369');
  await correct(page);
  await next(page);

  // 2. Writing in the ring's light
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Whispers');
  await arrive(page);
  await page.getByRole('button', { name: 'Sweep the light' }).click();
  await answer(page, 'Buchbinder');
  await correct(page);
  await next(page);

  // 3. The interrogation
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Night Watchman');
  await arrive(page);
  for (const q of ['Have you seen a man in a grey coat?', 'Do you know this ring?', 'Who was the young woman?', 'How did she get rid of it?']) {
    await page.getByRole('button', { name: `“${q}”` }).click();
  }
  await expect(page.getByText('You have asked everything.', { exact: false })).toBeVisible();
  await expect(page.getByText('Ask for Hedda.', { exact: false })).toBeVisible();
  await page.getByLabel('Hedda Lorenz').check();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await correct(page);
  await next(page);

  // 4. The chase
  await arrive(page);
  await page.getByLabel('Narrow Lane').check();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await correct(page);
  await next(page);

  // 5. The torn ledger: shown c a d b, solved b a c d
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Guild Ledger');
  await arrive(page);
  for (const strip of [4, 3, 2, 3]) await page.getByRole('button', { name: `Move up: Strip ${strip}` }).click();
  await expect(page.locator('ol li p').first()).toContainText('In the year of the great flood');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await correct(page);
  await next(page);

  // 6. The hallmarks
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Goldsmith’s Name');
  await arrive(page);
  await answer(page, 'فالين');
  await correct(page);
  await next(page);

  // 7. The cipher wheel: five clicks decode Hedda's letter
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hedda’s Letter');
  await arrive(page);
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Turn the wheel right' }).click();
  await expect(page.getByText('FORGIVE ME. I WAS AFRAID.')).toBeVisible();
  await answer(page, 'forgive me');
  await correct(page);
  // The story decision: the next chapter waits for it, and it cannot be changed afterwards.
  await expect(page.getByRole('button', { name: /Next chapter|To the finale/ })).toBeDisabled();
  await page.getByRole('button', { name: /Confront her/ }).click();
  await expect(page.getByText('she will explain herself to me', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: /Forgive her/ })).toHaveCount(0);
  await next(page);

  // 8. The accusation on the bridge
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Midnight on the Bridge');
  await arrive(page);
  await page.locator('label', { hasText: /^VA?Valen/ }).first().click();
  await page.locator('label', { hasText: 'Hallmark rubbing' }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await correct(page);

  // The journal kept the watchman's statements
  await page.getByRole('button', { name: /Journal/ }).click();
  await page.getByRole('tab', { name: /People/ }).click();
  await expect(page.getByRole('dialog').getByText('Ask for Hedda.', { exact: false })).toBeVisible();
  // The decision shows in what the journal says about Hedda, and only the one that was made.
  await expect(page.getByRole('dialog').getByText('You want the truth from her, face to face.')).toBeVisible();
  await expect(page.getByRole('dialog').getByText('You chose to forgive her.')).toHaveCount(0);
  await page.getByRole('button', { name: 'Close' }).click();
  await next(page);

  // The bridge scene follows the decision.
  await expect(page.getByText('“Why me?” you ask.', { exact: false })).toBeVisible();
  await expect(page.getByText('“I forgive you.”', { exact: false })).toHaveCount(0);

  // Three endings; the bittersweet one
  await expect(page.getByRole('button', { name: 'Give the ring back to Hedda' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Keep the ring' })).toBeVisible();
  await page.getByRole('button', { name: 'Give the ring back to Hedda' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mystery solved');
  await expect(page.getByText('It was always mine', { exact: false })).toBeVisible();
  await expect(page.getByText('She does not ask for your forgiveness.', { exact: false })).toBeVisible();
  await expect(page.getByText('Expert', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('Master detective').first()).toBeVisible(); // no hints, no mistakes
  await noHorizontalScroll(page);
});

test('The Neckar Ring is listed under Outdoor escape with its premium price', async ({ page }) => {
  await page.goto('/de/adventures?theme=escape');
  await page.getByRole('link', { name: 'Der Ring vom Neckar' }).click();
  await expect(page.locator('aside').getByText('34,90 €')).toBeVisible();
});
