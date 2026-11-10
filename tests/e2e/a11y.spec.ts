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
  for (const [path, width] of [['/nl/legal/privacy', 390], ['/de/legal/terms', 320], ['/ar/legal/privacy', 320], ['/de', 320]] as const) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(path);
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
