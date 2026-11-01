import { expect, test } from '@playwright/test';
import { fresh } from './helpers';

test('the start screen is a case file: briefing, first contact, facts, no spoilers', async ({ page }) => {
  await fresh(page, '/en/play/neckar-ring');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Neckar Ring');
  await expect(page.getByText('Case file')).toBeVisible();
  await expect(page.getByText('120–180 min · 1–5 people · 14+')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The case' })).toBeVisible();
  // Only the first chapter's people are introduced; later ones (Mira, Valen) stay a surprise.
  const contact = page.getByRole('region', { name: 'First contact' });
  await expect(contact.getByText('Hedda Lorenz')).toBeVisible();
  await expect(contact.getByText('Mira Falk')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Ready to begin?' })).toBeVisible();
});

test('on a phone a bar always says where to go next and jumps to the arrival options', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The bar is for small screens only.');
  await fresh(page, '/en/play/het-duivelshuis');
  // 2D, so a cutscene loading above does not move the page while it scrolls.
  await page.evaluate(() => localStorage.setItem('cityquest:3d', 'off'));
  await page.reload();
  await page.getByRole('button', { name: 'Start the adventure' }).click();
  const bar = page.getByRole('button', { name: 'Confirm arrival' });
  await expect(bar).toBeVisible();
  await bar.click();
  await expect(page.getByRole('button', { name: 'Confirm manually' })).toBeInViewport();
  await expect(bar).toHaveCount(0);
});
