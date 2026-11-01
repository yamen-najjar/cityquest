import { expect, test } from '@playwright/test';
import { answer, arrive, correct, fresh, next, noHorizontalScroll, setCode } from './helpers';

const PLAY = '/en/play/het-duivelshuis';

// A full playthrough of the Arnhem adventure "The Devil's House Secret": the eight puzzle types
// (cipher, logic, interrogate, number-code, reveal, morse, item-use, deduction), the journal
// combination that makes the proof, the finale and the Arnhem results.
test('The Devil’s House Secret: all eight chapters, the combined ledger, the accusation and results', async ({ page }) => {
  test.setTimeout(240_000);
  await fresh(page, PLAY);

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Devil’s House Secret');
  await page.getByRole('button', { name: 'Start the adventure' }).click();

  // 1. Cipher — the numbers spell DEVILS.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Anonymous Message');
  await arrive(page);
  await answer(page, 'devils');
  await correct(page);
  await next(page);

  // 2. Logic — exactly one of the three devils tells the truth; the key is behind the middle one.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Three Devils');
  await arrive(page);
  await page.getByRole('radio', { name: 'Middle devil' }).check();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await correct(page);
  await next(page);

  // 3. Interrogate — question Bram, then choose where Lena went.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Witness at the Sabelspoort');
  await arrive(page);
  await page.getByRole('button', { name: /Did you see a woman with a folder/ }).click();
  await page.getByRole('radio', { name: 'The Eusebius church' }).check();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await correct(page);
  await next(page);

  // 4. Number code — the figures on the church no medieval mason could have carved (the dwarf, Tom Poes,
  // the water bear, the virus): IX IV VII II = 9472. The real-world "True story" clue lands in the journal.
  // Then combine the two ledger halves in the journal to make the proof for the finale.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Strangers in Stone');
  await arrive(page);
  await expect(page.getByText('Tom Poes, the white cat from the Dutch comic strip — IV')).toBeVisible();
  await setCode(page, '9472');
  await correct(page);

  await page.getByRole('button', { name: /Journal/ }).click();
  const journal = page.getByRole('dialog', { name: 'Case journal' });
  await journal.getByRole('tab', { name: /Items/ }).click();
  await journal.getByRole('checkbox', { name: /Half a ledger page/ }).check();
  await journal.getByRole('checkbox', { name: /Left half of the ledger page/ }).check();
  await journal.getByRole('button', { name: 'Put together' }).click();
  await expect(page.getByText('New item: The whole ledger page')).toBeVisible();
  await journal.getByRole('button', { name: 'Close' }).click();
  await next(page);

  // 5. Reveal — hidden mirrored writing points to the Rhine.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Waterfall in Sonsbeek Park');
  await arrive(page);
  await page.getByRole('button', { name: 'Sweep the light' }).click();
  await answer(page, 'to the rhine');
  await correct(page);
  await next(page);

  // 6. Morse — the signal is 1545, the year the Devil's House was built.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Signal Across the Rhine');
  await arrive(page);
  await page.getByRole('button', { name: 'Watch the lantern' }).click();
  await setCode(page, '1545');
  await correct(page);
  await next(page);

  // 7. Item use — the old iron key opens the middle drawer.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Middle Drawer');
  await arrive(page);
  await page.getByRole('radio', { name: 'Old iron key' }).check();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await correct(page);
  // The story choice: ask Saar to wait instead of calling the police.
  await page.getByRole('button', { name: /Ask her to wait/ }).click();
  await next(page);

  // 8. Deduction — the wrong proof first, then the whole ledger page convicts Koster.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Accusation');
  await arrive(page);
  // The deduction suspect/proof radios are visually hidden (sr-only), driven through their labels.
  await page.getByRole('radio', { name: 'Daan Koster' }).check({ force: true });
  await page.getByRole('radio', { name: 'The whole ledger page' }).check({ force: true });
  await page.getByRole('button', { name: 'Check answer' }).click();
  await correct(page);
  await next(page);

  // Finale and results.
  await expect(page.getByText('The devils guard no gold.', { exact: false })).toBeVisible();
  await expect(page.getByText('No sirens, no lights', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Read the first page aloud at the Korenmarkt' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mystery solved');
  await expect(page.getByText('At the back of the crowd stands a man in a velvet coat', { exact: false })).toBeVisible();
  await expect(page.locator('#chapters-title + ol li')).toHaveCount(8);
  await expect(page.locator('#certificate')).toContainText('in Arnhem');
  await noHorizontalScroll(page);
});
