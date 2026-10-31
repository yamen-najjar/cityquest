import { expect, test } from '@playwright/test';
import { fresh, noHorizontalScroll } from './helpers';

test('the game in Dutch: the Dutch cipher, a Dutch answer and the journal', async ({ page }) => {
  await fresh(page, '/nl/play/lost-manuscript');
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Klaar om te beginnen?');
  await page.getByRole('button', { name: 'Start het avontuur' }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Het anonieme bericht');
  await page.getByRole('button', { name: /Handmatig bevestigen|Ik ben bij het controlepunt/ }).click();
  // The number cipher spells the Dutch word TOREN.
  await expect(page.getByText('20 · 15 · 18 · 5 · 14')).toBeVisible();
  await page.getByRole('textbox', { name: 'Jouw antwoord' }).fill('toren');
  await page.getByRole('button', { name: 'Antwoord controleren' }).click();
  await expect(page.getByRole('heading', { name: 'Goed zo!' })).toBeVisible();
  await expect(page.getByText('Nieuw spoor in het dossier').first()).toBeVisible();

  await page.getByRole('button', { name: /Dossier/ }).click();
  await expect(page.getByRole('dialog').getByText('VII stuurde het bericht om 21:07.')).toBeVisible();
  await page.getByRole('button', { name: 'Sluiten' }).click();
  await noHorizontalScroll(page);

  // The adventure page and its price in Dutch formatting.
  await page.goto('/nl/adventures/neckar-ring');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('De ring van de Neckar');
  await expect(page.locator('aside').getByText('€ 34,90')).toBeVisible();
});
