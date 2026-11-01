import { expect, test } from '@playwright/test';
import { answer, arrive, correct, fresh, next, noHorizontalScroll, setCode } from './helpers';

const PLAY = '/play/lost-manuscript';

test.beforeEach(async ({ page }) => {
  await fresh(page, `/en${PLAY}`);
});

test('The Lost Manuscript: all eight chapters, journal, combining, Morse, the accusation, results', async ({ page }) => {
  test.setTimeout(300_000);
  // Start: team, players, difficulty
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Lost Manuscript');
  await page.getByRole('textbox', { name: 'Team name (optional)' }).fill('Night Owls');
  await page.getByText('3', { exact: true }).click();
  await expect(page.getByRole('radio', { name: /Classic/ })).toBeChecked();
  await page.getByRole('button', { name: 'Start the adventure' }).click();

  // 1. Cipher, with a wrong answer and three-step hints (the last is the solution)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Anonymous Message');
  await arrive(page);
  await answer(page, 'bridge');
  await expect(page.getByText('Not quite.')).toBeVisible();
  await page.getByRole('button', { name: 'Show a hint' }).click();
  await expect(page.getByText('Hint 1 of 3')).toBeVisible();
  await page.getByRole('button', { name: 'Show another hint' }).click();
  await page.getByRole('button', { name: 'Show the solution' }).click();
  await expect(page.getByText('Solution', { exact: true })).toBeVisible();
  await answer(page, 'Tower');
  await correct(page);
  await expect(page.getByText('New clue in the journal').first()).toBeVisible();
  await next(page);

  // Resume after a reload, then switch to Arabic mid-chapter
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Three Witnesses');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Three Witnesses');
  await page.getByRole('link', { name: 'العربية' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

  // 2. Logic, in Arabic
  await arrive(page, /التأكيد يدويًا|وصلت إلى نقطة التفتيش/);
  await page.getByLabel('كلارا').check();
  await page.getByRole('button', { name: 'تحقق من الإجابة' }).click();
  await expect(page.getByRole('heading', { name: 'إجابة صحيحة!' })).toBeVisible();
  await page.getByRole('button', { name: 'الفصل التالي' }).click();
  await page.getByRole('link', { name: 'English' }).click();

  // 3. The symbol lock: wrong on the dials, right typed with Arabic digits
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Clockmaker’s Lock');
  await arrive(page);
  await setCode(page, '1234');
  await expect(page.getByText('Not quite.')).toBeVisible();
  const typeInstead = page.getByRole('button', { name: 'Type the code instead' });
  if (await typeInstead.count()) await typeInstead.click();
  await answer(page, '٧٣٤٧');
  await correct(page);
  await next(page);

  // 4. Invisible writing on the blotting paper
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Professor’s Study');
  await arrive(page);
  await expect(page.getByRole('img', { name: /shine the light/ })).toBeVisible();
  await page.getByRole('button', { name: 'Sweep the light' }).click();
  await answer(page, 'the river');
  await correct(page);
  await expect(page.getByText('Left half of a letter').first()).toBeVisible();

  // The journal: clues, people, notes, and putting the two letter halves together
  await page.getByRole('button', { name: /Journal/ }).click();
  const journal = page.getByRole('dialog', { name: 'Case journal' });
  // With questions open, the journal opens on the evidence board; the clues are one tab over.
  await expect(journal.getByRole('tab', { name: /Board/ })).toHaveAttribute('aria-selected', 'true');
  await journal.getByRole('tab', { name: /Clues/ }).click();
  await expect(journal.getByText('Kehl was going to the chest by the river tonight.')).toBeVisible();
  await journal.getByRole('tab', { name: /People/ }).click();
  await expect(journal.getByText('Prof. Albrecht Kehl')).toBeVisible();
  await journal.getByRole('tab', { name: /Items/ }).click();
  await journal.getByRole('checkbox', { name: /Torn letter/ }).check();
  await journal.getByRole('checkbox', { name: /Left half of a letter/ }).check();
  await journal.getByRole('button', { name: 'Put together' }).click();
  await expect(page.getByText('New item: The whole letter')).toBeVisible();
  await expect(journal.getByText('The whole letter')).toBeVisible();
  await journal.getByRole('tab', { name: /Notes/ }).click();
  await journal.getByRole('textbox', { name: 'Notes' }).fill('Kehl is hiding something.');
  await page.waitForTimeout(700);
  await journal.getByRole('button', { name: 'Close' }).click();
  // The story choice in Kehl's study: leave the diary closed.
  await page.getByRole('button', { name: /Leave it closed/ }).click();
  await expect(page.getByText('you will hear it from him', { exact: false })).toBeVisible();
  await next(page);

  // 5. Use an item from the inventory
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Riverside Chest');
  await arrive(page);
  await page.getByLabel('Brass key').check();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Not quite.')).toBeVisible();
  await page.getByLabel('Lantern map').check();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await correct(page);
  await next(page);

  // 6. The Morse signal
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Lantern Signal');
  await arrive(page);
  await page.getByRole('button', { name: 'Watch the lantern' }).click();
  await expect(page.getByText('Code book: digits')).toBeVisible();
  await setCode(page, '1847');
  await correct(page);
  await next(page);

  // 7. Mirrored letters
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Mirror Page');
  await arrive(page);
  await answer(page, 'Stories');
  await correct(page);
  await next(page);

  // 8. The accusation: the wrong proof first, then the combined letter
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Break-in');
  await arrive(page);
  await page.locator('label', { hasText: 'Prof. Albrecht Kehl' }).click();
  await page.locator('label', { hasText: 'Brass key' }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Not quite.')).toBeVisible();
  await page.locator('label', { hasText: 'The whole letter' }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await correct(page);
  await next(page);

  // Finale and results
  await expect(page.getByText('You protect a book by opening it.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Write the first story of your own' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mystery solved');
  await expect(page.getByText('Rank', { exact: true })).toBeVisible();
  await expect(page.locator('#chapters-title + ol li')).toHaveCount(8);
  await expect(page.locator('#certificate')).toContainText('Night Owls solved “The Lost Manuscript” in Heidelberg.');
  await noHorizontalScroll(page);

  // The notes survived, and the dashboard counts the whole adventure
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('cityquest:progress:lost-manuscript')!).notes)).toBe('Kehl is hiding something.');
  await page.goto('/en/dashboard');
  await expect(page.getByText('8 of 8 chapters')).toBeVisible();

  // Play again
  await page.goto(`/en${PLAY}`);
  await page.getByRole('button', { name: 'Play again' }).click();
  await page.getByRole('button', { name: 'Yes, start over' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Lost Manuscript');
});

test('an empty answer is caught before it is sent', async ({ page }) => {
  await page.getByRole('button', { name: 'Start the adventure' }).click();
  await arrive(page);
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Type an answer first.')).toBeVisible();
});
