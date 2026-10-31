// Real map + GPS checkpoint verification (Phase 4). No backend needed: the map tiles come from
// OpenStreetMap and geolocation is faked by Playwright. The arrival buttons render regardless of the
// map, so they're the robust assertions; the map container is checked too.
import { expect, test } from '@playwright/test';

async function startChapterOne(page: import('@playwright/test').Page) {
  await page.goto('/en/play/lost-manuscript');
  await page.getByRole('button', { name: 'Start the adventure' }).click();
}

test.describe('Real map + GPS checkpoint', () => {
  test('shows the checkpoint map and offers GPS, QR and manual', async ({ page }) => {
    await startChapterOne(page);
    await expect(page.locator('.maplibregl-map')).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('.maplibregl-marker')).toHaveCount(8);
    await expect(page.getByRole('button', { name: 'I’m here' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Scan QR code' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirm manually' })).toBeVisible();
  });

  test('GPS at the checkpoint confirms arrival', async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 49.4093, longitude: 8.6937 }); // chapter 1 checkpoint
    await startChapterOne(page);
    await expect(page.locator('.maplibregl-map')).toBeVisible({ timeout: 20_000 });
    await page.getByRole('button', { name: 'I’m here' }).click();
    await expect(page.getByText('You’re here')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('button', { name: 'Continue to the puzzle' })).toBeVisible();
  });

  test('manual confirmation always advances to the puzzle', async ({ page }) => {
    await startChapterOne(page);
    await page.getByRole('button', { name: 'Confirm manually' }).click();
    // The travel map is gone once we're on the puzzle step.
    await expect(page.locator('.maplibregl-map')).toHaveCount(0);
  });
});
