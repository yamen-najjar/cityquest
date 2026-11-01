import { expect, test } from '@playwright/test';
import { fresh } from './helpers';

// A save at the end of chapter 2 (the witnesses), where the first board question opens.
const save = () => ({
  version: 2,
  adventure: 'lost-manuscript',
  mode: 'classic',
  chapter: 1,
  stage: 'solved',
  solved: ['message', 'witnesses'],
  inventory: ['torn-letter', 'brass-key'],
  hintsUsed: {},
  wrongAttempts: {},
  asked: {},
  notes: '',
  deductions: [],
  decision: null,
  team: { name: 'Owls', players: 2 },
  startedAt: Date.now() - 60_000,
  finishedAt: null,
  elapsedMs: 60_000,
  lastActiveAt: Date.now(),
});

test('the evidence board: a wrong connection, the right one, and it is saved', async ({ page }) => {
  await fresh(page, '/en/play/lost-manuscript');
  await page.evaluate((s) => {
    localStorage.setItem('cityquest:progress:lost-manuscript', JSON.stringify(s));
    sessionStorage.setItem('cityquest:playing', 'lost-manuscript');
  }, save());
  await page.reload();

  await page.getByRole('button', { name: /Journal/ }).click();
  const journal = page.getByRole('dialog', { name: 'Case journal' });
  // The board opens first while a question is open; later questions are not shown yet.
  await expect(journal.getByRole('tab', { name: /Board/ })).toHaveAttribute('aria-selected', 'true');
  await expect(journal.getByText('Who sent you the lantern signal from the archive?')).toHaveCount(0);
  await journal.getByRole('button', { name: /Who lied\?/ }).click();

  const connect = journal.getByRole('button', { name: 'Connect' });
  await expect(connect).toBeDisabled();
  await journal.getByRole('button', { name: /Ben/ }).click();
  await journal.getByRole('button', { name: /Brass key/ }).click();
  await journal.getByRole('button', { name: /Clara hid the key/ }).click();
  await connect.click();
  await expect(journal.getByText('That does not hold up yet.')).toBeVisible();

  await journal.getByRole('button', { name: /Anna/ }).click();
  await connect.click();
  await expect(journal.getByText(/Anna lied\. Clara had the key all along/)).toBeVisible();

  const deductions = await page.evaluate(() => JSON.parse(localStorage.getItem('cityquest:progress:lost-manuscript')!).deductions);
  expect(deductions).toEqual(['liar']);
});
