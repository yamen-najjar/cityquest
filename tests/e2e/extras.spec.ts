import { expect, test, type Page } from '@playwright/test';
import { arrive, fresh, noHorizontalScroll } from './helpers';

const DAY = 24 * 60 * 60 * 1000;

function finished(slug: string, chapters: string[], secrets: string[], decision: string, finishedAt: number) {
  return {
    version: 2,
    adventure: slug,
    mode: 'classic',
    chapter: chapters.length,
    stage: 'solved',
    solved: chapters,
    inventory: [],
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
    secrets,
    reportPicks: {},
    reportConfirmed: [],
    reportTries: 0,
    reportDone: 'solved',
    decision,
    team: { name: 'Owls', players: 2 },
    startedAt: finishedAt - 3_600_000,
    finishedAt,
    elapsedMs: 3_600_000,
    lastActiveAt: finishedAt,
  };
}

async function seed(page: Page, saves: Record<string, unknown>[]) {
  await fresh(page, '/en/dashboard');
  await page.evaluate((list) => {
    for (const s of list as { adventure: string }[]) localStorage.setItem(`cityquest:progress:${s.adventure}`, JSON.stringify(s));
  }, saves);
  await page.reload();
}

test('the dashboard: a letter after a week, and the lantern signs of every case', async ({ page }) => {
  const now = Date.now();
  await seed(page, [
    finished('lost-manuscript', ['message', 'witnesses', 'clockmaker', 'study', 'chest', 'signal', 'mirror', 'verdict'], ['lantern-mark', 'initials'], 'return', now - 8 * DAY),
    finished('neckar-ring', ['box', 'whispers', 'watchman', 'chase', 'ledger', 'goldsmith', 'letter', 'bridge'], ['kind-wish'], 'free', now - 2 * DAY),
  ]);

  // A week after Heidelberg the letter is there; two days after the Neckar Ring it is still on its way.
  await page.getByRole('button', { name: 'A letter has arrived' }).click();
  await expect(page.getByText('strangers see what the rest of us stopped seeing', { exact: false })).toBeVisible();
  await expect(page.getByText('A letter is on its way · 5 days')).toBeVisible();

  // Every secret found in Heidelberg wins its sign; one secret missing on the Neckar keeps it hidden.
  const signs = page.locator('section', { has: page.getByRole('heading', { name: /The Lantern Keepers/ }) });
  await expect(signs.getByText('1 of 3 lantern signs')).toBeVisible();
  await expect(signs.getByText('What is kept')).toBeVisible();
  await expect(signs.getByText('is never lost')).toHaveCount(0);
  await noHorizontalScroll(page);
});

test('all three signs reveal the Lantern Keepers’ message', async ({ page }) => {
  const now = Date.now();
  await seed(page, [
    finished('lost-manuscript', ['message', 'witnesses', 'clockmaker', 'study', 'chest', 'signal', 'mirror', 'verdict'], ['lantern-mark', 'initials'], 'return', now),
    finished('neckar-ring', ['box', 'whispers', 'watchman', 'chase', 'ledger', 'goldsmith', 'letter', 'bridge'], ['kind-wish', 'mirror-niche'], 'free', now),
    finished('het-duivelshuis', ['message', 'duivels', 'sabelspoort', 'carillon', 'sonsbeek', 'rijnkade', 'archief', 'aanklacht'], ['velvet-thread', 'devil-stamp'], 'archive', now),
  ]);
  await expect(page.getByText('3 of 3 lantern signs')).toBeVisible();
  await expect(page.getByText('You found us. Not many do.')).toBeVisible();
});

test('the case dossier: a printable sheet without spoilers', async ({ page }) => {
  await fresh(page, '/en/adventures/het-duivelshuis');
  await page.getByRole('link', { name: /Print the case dossier/ }).click();
  await expect(page).toHaveURL(/\/en\/adventures\/het-duivelshuis\/dossier$/);
  const sheet = page.locator('#dossier');
  await expect(sheet.getByRole('heading', { level: 1 })).toHaveText('The Devil’s House Secret');
  await expect(sheet.getByText('Three stone devils have guarded that house', { exact: false })).toBeVisible();
  await expect(sheet.getByText('Confidential')).toBeVisible();
  await expect(page.getByRole('button', { name: /Print/ })).toBeVisible();
  await noHorizontalScroll(page);
});

test('a replay tells another truth: the next game draws a second culprit, the one after the original again', async ({ page }) => {
  const chapters = ['message', 'witnesses', 'clockmaker', 'study', 'chest', 'signal', 'mirror', 'verdict'];
  await fresh(page, '/en/play/lost-manuscript');
  await page.evaluate((s) => {
    localStorage.setItem('cityquest:3d', 'off');
    localStorage.setItem('cityquest:progress:lost-manuscript', JSON.stringify(s));
    sessionStorage.setItem('cityquest:playing', 'lost-manuscript');
  }, finished('lost-manuscript', chapters, [], 'return', Date.now()));
  await page.reload();

  await page.getByRole('button', { name: 'Play again' }).click();
  await page.getByRole('button', { name: 'Yes, start over' }).click();
  await expect(page.getByText('Another truth: The Night Guard')).toBeVisible();
  await page.getByRole('button', { name: 'Start the adventure' }).click();
  await arrive(page);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('cityquest:progress:lost-manuscript')!));
  expect(saved.variant).toBe('anna');

  // Starting over in the middle keeps the truth; only finishing a case moves on to the next one.
  await page.goto('/en/play/lost-manuscript');
  await page.evaluate((s) => localStorage.setItem('cityquest:progress:lost-manuscript', JSON.stringify(s)), { ...finished('lost-manuscript', chapters, [], 'return', Date.now()), variant: 'anna' });
  await page.reload();
  await page.getByRole('button', { name: 'Play again' }).click();
  await page.getByRole('button', { name: 'Yes, start over' }).click();
  await expect(page.getByRole('button', { name: 'Start the adventure' })).toBeVisible();
  await expect(page.getByText('Another truth', { exact: false })).toHaveCount(0);
});

test('junior mode: every puzzle explained for young detectives', async ({ page }) => {
  await fresh(page, '/en/play/lost-manuscript');
  await page.getByText('Junior', { exact: true }).click();
  await expect(page.getByRole('radio', { name: /Junior/ })).toBeChecked();
  await page.getByRole('button', { name: 'Start the adventure' }).click();
  await arrive(page);
  await expect(page.getByText('For young detectives')).toBeVisible();
  await expect(page.getByText('Numbers are letters!', { exact: false })).toBeVisible();
});
