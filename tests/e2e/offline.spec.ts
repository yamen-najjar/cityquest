// Offline play, against the production build (the service worker only runs there): open the game with
// reception, lose it, reload, and keep playing; plus the page shown for a site page that is not stored.
import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { answer, arrive, correct, next } from './helpers';

const PLAY = '/en/play/lost-manuscript';

/** Opens the game with reception and waits until it says it is ready for offline play. */
async function openOnline(page: Page) {
  await page.goto(PLAY);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect(page.getByTestId('offline-ready')).toBeVisible({ timeout: 90_000 });
}

async function startGame(page: Page) {
  await page.getByRole('textbox', { name: 'Team name (optional)' }).fill('Night Owls');
  await page.getByRole('button', { name: 'Start the adventure' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Anonymous Message');
}

async function goOffline(context: BrowserContext, page: Page) {
  await context.setOffline(true);
  await page.reload();
}

test.describe('offline play', () => {
  test('a game opened with reception can be reloaded and played without it', async ({ page, context }) => {
    test.setTimeout(180_000);
    await openOnline(page);
    await startGame(page);
    await expect(page.getByText('No reception: answers are checked on this device.')).toHaveCount(0);

    await goOffline(context, page);
    // The page itself came from the cache and the saved game resumed.
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Anonymous Message');
    await expect(page.getByText('No reception: answers are checked on this device.')).toBeVisible();

    // A wrong answer, then the right one, both graded on the device.
    await arrive(page);
    await answer(page, 'bridge');
    await expect(page.getByText('Not quite.')).toBeVisible();
    await answer(page, 'The Tower!');
    await correct(page);
    await next(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Three Witnesses');

    // The progress survives another offline reload, and is still there when reception returns.
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Three Witnesses');
    await context.setOffline(false);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Three Witnesses');
    await expect(page.getByText('No reception: answers are checked on this device.')).toHaveCount(0);
  });

  test('online answers still go to the server, which stays the authority', async ({ page }) => {
    await openOnline(page);
    await startGame(page);
    const checks: string[] = [];
    page.on('request', (req) => req.url().includes('/check') && checks.push(req.url()));
    await arrive(page);
    await answer(page, 'bridge');
    await expect(page.getByText('Not quite.')).toBeVisible();
    expect(checks).toHaveLength(1);
  });

  test('without a stored pack, offline answers say so instead of guessing', async ({ page, context }) => {
    test.setTimeout(180_000);
    await openOnline(page);
    await startGame(page);
    await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('cityquest:pack:')).forEach((k) => localStorage.removeItem(k)));
    await goOffline(context, page);
    await arrive(page);
    await answer(page, 'tower');
    await expect(page.getByText('No reception, and this adventure isn’t on this device yet. Open it once with internet.')).toBeVisible();
  });

  test('a site page that is not stored shows the offline page; a stored one still opens', async ({ page, context }) => {
    test.setTimeout(120_000);
    await page.goto('/en');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    await page.reload(); // now loaded through the worker, so the home page is stored
    await context.setOffline(true);

    await page.goto('/en/cities'); // never opened
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('You are offline');
    await expect(page.getByRole('link', { name: 'Back to the start' })).toBeVisible();
    await page.getByRole('link', { name: 'Back to the start' }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByRole('heading', { level: 1 }).first()).not.toHaveText('You are offline');

    // The Dutch offline page is in Dutch.
    await page.goto('/nl/cities');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Je bent offline');
  });
});
