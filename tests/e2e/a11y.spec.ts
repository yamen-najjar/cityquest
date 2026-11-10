import { expect, test } from '@playwright/test';
import { fresh } from './helpers';

async function noHorizontalScroll(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test('the skip link is the first stop and moves keyboard focus to the main content', async ({ page }) => {
  await page.goto('/en/cities');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('main#main')).toBeFocused();
});

test('every page names its language and direction, and a German legal term inside a title is marked as German', async ({ page }) => {
  for (const [locale, dir] of [['de', 'ltr'], ['en', 'ltr'], ['nl', 'ltr'], ['ar', 'rtl']] as const) {
    await page.goto(`/${locale}/legal/privacy`);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('html')).toHaveAttribute('dir', dir);
    if (locale !== 'de') await expect(page.locator('h1 [lang="de"]')).toHaveText('Datenschutzerklärung');
  }
});

test('long legal titles wrap instead of overflowing a phone screen', async ({ page }) => {
  for (const [path, width] of [['/nl/legal/privacy', 390], ['/de/legal/terms', 320], ['/ar/legal/privacy', 320], ['/de', 320], ['/nl', 320]] as const) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(path);
    // Browsers without a hyphenation dictionary (CI Linux, some phones) must still wrap by the fallback alone.
    await page.addStyleTag({ content: '*{hyphens:none !important}' });
    await noHorizontalScroll(page);
  }
});

test.describe('the phone menu', () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test('Escape closes it and puts focus back on the menu button', async ({ page }) => {
    await page.goto('/en/cities');
    const button = page.locator('.tp-menu-button');
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await expect(page.locator('#mobile-menu').getByRole('link').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
  });
});

test('the case journal is a modal dialog: focus stays inside, Escape closes it and focus goes back', async ({ page }) => {
  await fresh(page, '/en/play/lost-manuscript');
  await page.getByRole('button', { name: 'Start the adventure' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Anonymous Message');

  const open = page.getByRole('button', { name: /Journal/ });
  await open.focus();
  await page.keyboard.press('Enter');
  const journal = page.getByRole('dialog', { name: 'Case journal' });
  await expect(journal).toBeVisible();
  await expect(journal.getByRole('button', { name: 'Close' })).toBeFocused();

  // Tab never leaves the dialog, in either direction.
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
  }
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);

  // Tabs: one tab stop, the arrow keys move between them and select.
  const tabs = journal.getByRole('tab');
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(journal.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', (await tabs.nth(1).getAttribute('id')) ?? '');

  await page.keyboard.press('Escape');
  await expect(journal).toHaveCount(0);
  await expect(open).toBeFocused();
});

test('the game screen stays within a 320px phone in Arabic', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await fresh(page, '/ar/play/neckar-ring');
  await page.locator('form button[type="submit"]').click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await noHorizontalScroll(page);
});

test('the journal tabs mirror their arrow keys in Arabic', async ({ page }) => {
  await fresh(page, '/ar/play/lost-manuscript');
  await page.locator('form button[type="submit"]').click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.locator('header button[aria-haspopup="dialog"]').last().click();
  const tabs = page.getByRole('dialog').getByRole('tab');
  await tabs.first().focus();
  // Right to left: the next tab lies to the left.
  await page.keyboard.press('ArrowLeft');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(tabs.first()).toBeFocused();
});

test('hint and answer messages live in regions that exist before their text arrives', async ({ page }) => {
  await fresh(page, '/en/play/lost-manuscript');
  await page.getByRole('button', { name: 'Start the adventure' }).click();
  await page.getByRole('button', { name: /Confirm manually|I am at the checkpoint/ }).click();
  const puzzle = page.locator('section[aria-labelledby="puzzle-title"]');
  const hints = puzzle.locator('div[aria-live="polite"]');
  const feedback = puzzle.locator('#feedback');
  await expect(hints).toBeAttached();
  await expect(hints).toBeEmpty();
  await expect(feedback).toHaveAttribute('role', 'status');
  await expect(feedback).toBeEmpty();
  await page.getByRole('button', { name: 'Show a hint' }).click();
  await expect(hints).toContainText('Hint 1 of 3');
  await page.getByRole('textbox', { name: /answer/i }).fill('bridge');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(feedback).toContainText('Not quite.');
});

test('the 3D item viewer stacks over the journal: Escape closes only the top dialog and focus goes back', async ({ page }) => {
  // Seeded before any page script runs (once per tab), so the game opens straight into play on any machine.
  await page.addInitScript(() => {
    if (sessionStorage.getItem('a11y-seeded')) return;
    sessionStorage.setItem('a11y-seeded', '1');
    localStorage.setItem('cityquest:3d', 'on');
    const now = Date.now();
    const p = { version: 2, adventure: 'neckar-ring', mode: 'classic', chapter: 0, stage: 'puzzle', solved: [], inventory: ['cursed-ring'], hintsUsed: {}, wrongAttempts: {}, asked: {}, notes: '', deductions: [], choices: {}, caught: 0, relief: 0, seized: null, recovering: false, phoneRead: [], replies: {}, leadsSolved: [], secrets: [], reportPicks: {}, reportConfirmed: [], reportTries: 0, reportDone: null, variant: null, decision: null, team: { name: '', players: 2 }, startedAt: now, finishedAt: null, elapsedMs: 0, lastActiveAt: now };
    localStorage.setItem('cityquest:progress:neckar-ring', JSON.stringify(p));
    sessionStorage.setItem('cityquest:playing', 'neckar-ring');
  });
  await page.goto('/en/play/neckar-ring');
  // Should the start screen still show, continue the saved game from it.
  const resume = page.getByRole('button', { name: /^Continue/ });
  if (await resume.isVisible().catch(() => false)) await resume.click();
  await page.getByRole('button', { name: /Journal/ }).click();
  const journal = page.getByRole('dialog', { name: 'Case journal' });
  await journal.getByRole('tab', { name: /Items/ }).click();
  const view = journal.getByRole('button', { name: /View in 3D/ }).first();
  await view.click();
  const viewer = page.getByRole('dialog').filter({ has: page.locator('#viewer-title') });
  await expect(viewer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(viewer).toHaveCount(0);
  await expect(journal).toBeVisible();
  await expect(view).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(journal).toHaveCount(0);
});
