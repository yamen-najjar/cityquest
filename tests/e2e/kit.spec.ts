import { expect, test, type Page } from '@playwright/test';
import { fresh } from './helpers';

// The phone's seasonal messages depend on the date: pin it, outside any season unless a test says so.
const OFF_SEASON = new Date(2026, 5, 15, 20, 0);

function save(extra: Record<string, unknown> = {}, now = OFF_SEASON.getTime()) {
  return {
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
    choices: {},
    caught: 0,
    relief: 0,
    seized: null,
    recovering: false,
    phoneRead: [],
    replies: {},
    leadsSolved: [],
    secrets: [],
    decision: null,
    team: { name: 'Owls', players: 2 },
    startedAt: now - 60_000,
    finishedAt: null,
    elapsedMs: 60_000,
    lastActiveAt: now,
    ...extra,
  };
}

async function load(page: Page, s: Record<string, unknown>, date = OFF_SEASON) {
  await page.clock.setFixedTime(date);
  await fresh(page, '/en/play/lost-manuscript');
  await page.evaluate((x) => {
    localStorage.setItem('cityquest:3d', 'off');
    localStorage.setItem('cityquest:progress:lost-manuscript', JSON.stringify(x));
    sessionStorage.setItem('cityquest:playing', 'lost-manuscript');
  }, s);
  await page.reload();
}
const stored = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('cityquest:progress:lost-manuscript')!));

test('the phone: messages arrive with the story, a reply changes the answer, a file hides a secret', async ({ page }) => {
  await load(page, save());
  const phoneButton = page.getByRole('button', { name: /Phone/ });
  await expect(phoneButton).toContainText('3'); // three messages so far, all unread
  await phoneButton.click();
  const phone = page.getByRole('dialog', { name: 'Phone' });
  await expect(phone.getByText('Just follow the numbers.', { exact: false })).toBeVisible();
  await expect(phone.getByText('Some books are better left on the shelf', { exact: false })).toHaveCount(0); // not yet

  await phone.getByRole('button', { name: 'Why did you hide the key?' }).click();
  await expect(phone.getByText('Because VII asked me', { exact: false })).toBeVisible();
  await expect(phone.getByRole('button', { name: 'Your secret is safe.' })).toHaveCount(0);

  await phone.getByRole('button', { name: /Open the file/ }).click();
  await expect(phone.getByText('Archive duty log — the night of the theft')).toBeVisible();
  await phone.getByRole('button', { name: /Look closer/ }).click();
  await expect(page.getByText('Secret found: VII’s mark')).toBeVisible();

  const s = await stored(page);
  expect(s.replies).toEqual({ 'clara-log': 'why' });
  expect(s.secrets).toEqual(['lantern-mark']);
  expect(s.phoneRead.length).toBe(3);
});

test('a lead: confront a witness with the line that contradicts her', async ({ page }) => {
  await load(page, save());
  await page.getByRole('button', { name: /Journal/ }).click();
  const journal = page.getByRole('dialog', { name: 'Case journal' });
  await journal.getByRole('tab', { name: /Leads/ }).click();
  await journal.getByRole('button', { name: /Anna’s alibi/ }).click();
  await expect(journal.getByText('I was at the gate all night.', { exact: false })).toBeVisible();

  const confront = journal.getByRole('button', { name: 'Confront them with this' });
  await expect(confront).toBeDisabled();
  await journal.getByRole('button', { name: /Ben — reading room/ }).click();
  await confront.click();
  await expect(journal.getByText('Not quite.', { exact: false })).toBeVisible();
  await journal.getByRole('button', { name: /Anna — gate/ }).click();
  await confront.click();
  await expect(journal.getByText('I left at 22:40.', { exact: false })).toBeVisible();
  expect((await stored(page)).leadsSolved).toEqual(['anna-alibi']);
});

test('the detective report counts what was found and names what is still open', async ({ page }) => {
  const all = ['message', 'witnesses', 'clockmaker', 'study', 'chest', 'signal', 'mirror', 'verdict'];
  await load(page, save({ chapter: 8, stage: 'travel', solved: all, decision: 'return', finishedAt: Date.now(), choices: { study: 'leave' }, leadsSolved: ['anna-alibi'], secrets: ['initials'], deductions: ['liar'] }));
  await expect(page.getByRole('heading', { name: 'Detective report' })).toBeVisible();
  const report = page.getByRole('region', { name: 'Detective report' });
  await expect(report.getByText('1/4').first()).toBeVisible();
  await expect(report.getByText('That night, in order')).toBeVisible();
  await expect(report.getByText('Leave it closed', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save the card' })).toBeVisible();
});

test('trust and seasons: a kept secret brings Clara back; at Halloween VII writes about the lanterns', async ({ page }) => {
  const halloween = new Date(2026, 9, 31, 20, 0);
  await load(page, save({ chapter: 2, stage: 'travel', solved: ['message', 'witnesses', 'clockmaker'], replies: { 'clara-log': 'safe' } }, halloween.getTime()), halloween);

  // On the way: the story goes on while the team walks.
  await expect(page.getByRole('heading', { name: /On the way/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Listen while you walk/ })).toBeVisible();

  await page.getByRole('button', { name: /Phone/ }).click();
  const phone = page.getByRole('dialog', { name: 'Phone' });
  await expect(phone.getByText('the man in the long coat asked for', { exact: false })).toBeVisible();
  await expect(phone.getByText('the archive’s lanterns light themselves', { exact: false })).toBeVisible();
  await expect(phone.getByText('Clara will remember that.')).toBeVisible();
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: /Journal/ }).click();
  await page.getByRole('dialog', { name: 'Case journal' }).getByRole('tab', { name: /People/ }).click();
  await expect(page.getByRole('dialog', { name: 'Case journal' }).getByText('Trusts you')).toBeVisible();
});
