import { expect, test, type Page } from '@playwright/test';

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test('the home page loads in all three languages, Arabic right to left', async ({ page }) => {
  for (const [path, lang, dir, title] of [
    ['/de', 'de', 'ltr', 'Jede Stadt hat ein Geheimnis'],
    ['/en', 'en', 'ltr', 'Every City Has a Secret'],
    ['/nl', 'nl', 'ltr', 'Elke stad heeft een geheim'],
    ['/ar', 'ar', 'rtl', 'لكل مدينة سرّ'],
  ] as const) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('html')).toHaveAttribute('dir', dir);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(title);
    await noHorizontalScroll(page);
  }
});

test('a bare URL redirects to a language', async ({ page }) => {
  await page.goto('/adventures');
  await expect(page).toHaveURL(/\/(de|en|ar)\/adventures$/);
});

test('navigation, search and filters work', async ({ page, isMobile }) => {
  await page.goto('/en');
  await page.getByRole('searchbox', { name: 'Search adventures' }).fill('Heidelberg');
  await page.getByRole('button', { name: 'Search' }).first().click();
  await expect(page).toHaveURL(/\/en\/adventures\?q=Heidelberg/);
  await expect(page.getByRole('status').filter({ hasText: 'result' })).toHaveText('2 result(s)');

  await page.getByLabel('Theme').selectOption('treasure');
  await expect(page.getByText('No adventure matches these filters yet.')).toBeVisible();
  await page.getByRole('link', { name: 'Reset filters' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'result' })).toHaveText('2 result(s)');

  if (isMobile) await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('navigation', { name: 'Main navigation' }).last().getByRole('link', { name: 'Cities' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Explore cities');
  await page.getByRole('link', { name: 'Discover Heidelberg' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Heidelberg');

  await page.getByRole('link', { name: 'The Lost Manuscript' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Lost Manuscript');
  await expect(page.locator('aside').getByText('€24.90')).toBeVisible();
  await expect(page.locator('aside')).toContainText('incl. 19 % VAT (€3.98)');
  await noHorizontalScroll(page);
});

test('switching language keeps the page and its filters', async ({ page, isMobile }) => {
  await page.goto('/en/adventures?theme=mystery');
  if (isMobile) await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Deutsch' }).click();
  await expect(page).toHaveURL(/\/de\/adventures\?theme=mystery$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Abenteuer');
});

test('the newsletter form validates and does not pretend to subscribe', async ({ page }) => {
  await page.goto('/en');
  const email = page.getByRole('textbox', { name: 'Email address' });
  await email.fill('not-an-email');
  await page.getByRole('button', { name: 'Notify me' }).click();
  await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
  await email.fill('player@example.com');
  await page.getByRole('button', { name: 'Notify me' }).click();
  await expect(page.getByText('your address was not saved or sent anywhere')).toBeVisible();
});

test('unknown pages show the localised 404', async ({ page }) => {
  const res = await page.goto('/de/gibt-es-nicht');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hier verliert sich die Spur');
});
