import { expect, test } from '@playwright/test';
import { arrive, fresh } from './helpers';

const saved = (page: import('@playwright/test').Page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem('cityquest:progress:lost-manuscript') ?? 'null')?.notes as string | undefined);

test('journal notes survive closing the journal or reloading right after typing', async ({ page }) => {
  await fresh(page, '/en/play/lost-manuscript');
  await page.getByRole('button', { name: 'Start the adventure' }).click();
  await arrive(page);

  const notes = () => page.getByRole('dialog', { name: 'Case journal' }).getByRole('textbox');
  const openNotes = async () => {
    await page.getByRole('button', { name: /Journal/ }).click();
    await page.getByRole('tab', { name: /Notes/ }).click();
  };

  // Typed and closed at once: the half-second autosave never got to run before this fix.
  await openNotes();
  await notes().fill('Tower? Ask the watchman.');
  await page.getByRole('dialog', { name: 'Case journal' }).getByRole('button', { name: 'Close' }).click();
  expect(await saved(page)).toBe('Tower? Ask the watchman.');

  // Typed and reloaded at once.
  await openNotes();
  await notes().fill('Tower? Ask the watchman. VII = 21:07');
  await page.reload();
  expect(await saved(page)).toBe('Tower? Ask the watchman. VII = 21:07');
  await openNotes();
  await expect(notes()).toHaveValue('Tower? Ask the watchman. VII = 21:07');
});

test('a corrupt save for one adventure does not break the others', async ({ page }) => {
  await fresh(page, '/en/play/lost-manuscript');
  await page.getByRole('button', { name: 'Start the adventure' }).click();
  await arrive(page);
  await page.evaluate(() => {
    localStorage.setItem('cityquest:progress:neckar-ring', '{broken');
    const key = 'cityquest:progress:het-duivelshuis';
    localStorage.setItem(key, JSON.stringify({ version: 2, adventure: 'het-duivelshuis', chapter: 99, stage: 'puzzle', solved: [], inventory: [], team: { name: 'X', players: 2 } }));
  });

  await page.goto('/en/dashboard');
  await expect(page.getByText('The Lost Manuscript')).toBeVisible();

  // The save pointing past the last chapter starts at chapter 1 instead of jumping to the finale.
  await page.goto('/en/play/het-duivelshuis');
  await page.getByRole('button', { name: /Continue/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Anonymous Message');
});
