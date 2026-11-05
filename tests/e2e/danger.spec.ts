import { expect, test, type Page } from '@playwright/test';
import { arrive, fresh } from './helpers';

// A Neckar Ring save at chapter 4 (the chase) with the given hints already taken in chapter 3.
function save(extra: Record<string, unknown>) {
  const ids = ['box', 'whispers', 'watchman'];
  return {
    version: 2,
    adventure: 'neckar-ring',
    mode: 'classic',
    chapter: 3,
    stage: 'travel',
    solved: ids,
    inventory: ['cursed-ring', 'chalk-sign'],
    hintsUsed: { watchman: 3 },
    wrongAttempts: {},
    asked: {},
    notes: '',
    deductions: [],
    choices: {},
    caught: 0,
    relief: 0,
    seized: null,
    recovering: false,
    decision: null,
    team: { name: 'Owls', players: 2 },
    startedAt: Date.now() - 60_000,
    finishedAt: null,
    elapsedMs: 60_000,
    lastActiveAt: Date.now(),
    ...extra,
  };
}

async function load(page: Page, s: Record<string, unknown>) {
  await fresh(page, '/en/play/neckar-ring');
  await page.evaluate((x) => {
    localStorage.setItem('cityquest:3d', 'off');
    localStorage.setItem('cityquest:progress:neckar-ring', JSON.stringify(x));
    sessionStorage.setItem('cityquest:playing', 'neckar-ring');
  }, s);
  await page.reload();
  await arrive(page);
}

test('the pursuer catches the team, takes an item, and a puzzle wins it back', async ({ page }) => {
  // Three hints taken: one more brings him to “close”, the one after that reaches the team.
  await load(page, save({}));
  const help = page.getByRole('button', { name: 'Use the ring’s power' });
  await help.click();
  // The next hint would let him catch the team: it asks first, and can be called off.
  await help.click();
  await expect(page.getByText('will catch you and take something you carry', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('alertdialog', { name: /Caught/ })).toHaveCount(0);
  await help.click();
  await page.getByRole('button', { name: 'Take it anyway' }).click();

  const caught = page.getByRole('alertdialog', { name: 'Caught!' });
  await expect(caught).toBeVisible();
  await expect(caught.getByText('took: Chalk sign', { exact: false })).toBeVisible();
  await caught.getByRole('textbox').fill('table');
  await caught.getByRole('button', { name: 'Check answer' }).click();
  await expect(caught.getByText('Not quite.', { exact: false })).toBeVisible();
  await caught.getByRole('textbox').fill('mirror');
  await caught.getByRole('button', { name: 'Check answer' }).click();
  await expect(caught).toHaveCount(0);
  await expect(page.getByText('falls back — for now', { exact: false }).first()).toBeVisible();

  const inventory = await page.evaluate(() => JSON.parse(localStorage.getItem('cityquest:progress:neckar-ring')!).inventory);
  expect(inventory).toContain('chalk-sign');
});

test('caught a second time, the case is lost: the dark ending, no certificate', async ({ page }) => {
  // Already caught once and close again: the next hint loses the case.
  await load(page, save({ caught: 1, relief: 0, hintsUsed: { watchman: 3 } }));
  await page.getByRole('button', { name: 'Use the ring’s power' }).click();
  await page.getByRole('button', { name: 'Use the ring’s power' }).click();
  await expect(page.getByText('this time the case is lost', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Take it anyway' }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Case lost');
  await expect(page.getByText('The Grey Collector wins')).toBeVisible();
  await expect(page.locator('#certificate')).toHaveCount(0);
  await expect(page.getByText('Master detective')).toHaveCount(0);
});

test('two wrong answers offer the help and say what it costs; relaxed mode never loses', async ({ page }) => {
  await load(page, save({ mode: 'relaxed', hintsUsed: { watchman: 9 } }));
  // Danger at the highest level, but relaxed mode only shows it.
  await expect(page.getByRole('status').filter({ hasText: 'Danger: right behind you' })).toHaveCount(1);
  await expect(page.getByRole('alertdialog', { name: 'Caught!' })).toHaveCount(0);
  await page.getByRole('radio').first().check({ force: true });
  await page.getByRole('button', { name: 'Check answer' }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('but The Grey Collector will come one step closer', { exact: false })).toBeVisible();
});
