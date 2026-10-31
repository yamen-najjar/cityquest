// Auth + progress-sync end-to-end. Unlike the other e2e specs, this one needs the local Supabase stack
// running (supabase start) with Mailpit on 127.0.0.1:54324, and the redirect allowlist in
// supabase/config.toml must include the e2e origin (http://localhost:3100). See docs/PHASE2.md.
import { expect, test, type APIRequestContext } from '@playwright/test';

const MAILPIT = 'http://127.0.0.1:54324';

/** Poll Mailpit for the newest message to `address` and return the first link in its text body. */
async function magicLink(request: APIRequestContext, address: string): Promise<string> {
  for (let attempt = 0; attempt < 30; attempt++) {
    const search = await request.get(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:${address}`)}`);
    if (search.ok()) {
      const { messages } = (await search.json()) as { messages: { ID: string }[] };
      if (messages?.length) {
        const msg = await request.get(`${MAILPIT}/api/v1/message/${messages[0]!.ID}`);
        const { Text } = (await msg.json()) as { Text: string };
        const link = Text.match(/https?:\/\/\S+/)?.[0];
        if (link) return link;
      }
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`No magic-link email arrived for ${address}`);
}

/** Request a link on the account page and follow it, leaving the page signed in. */
async function signIn(page: import('@playwright/test').Page, request: APIRequestContext, address: string) {
  await page.goto('/en/account');
  await page.getByRole('textbox', { name: 'Email address' }).fill(address);
  await page.getByRole('button', { name: 'Send sign-in link' }).click();
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
  await page.goto(await magicLink(request, address));
  await expect(page).toHaveURL(/\/en\/account$/);
}

test('sign in with a magic link, then sign out', async ({ page, request }) => {
  const address = `e2e-auth-${Date.now()}@test.local`;
  await signIn(page, request, address);

  // Signed-in view and header reflect the session.
  await expect(page.getByText(address)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Account' })).toBeVisible();

  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
});

test('progress is mirrored to the account and restored on another device', async ({ page, request }) => {
  const address = `e2e-sync-${Date.now()}@test.local`;
  await signIn(page, request, address);

  // Seed a local save, then let the sign-in reconcile push it to the account.
  await page.evaluate(() => {
    const p = {
      version: 2, adventure: 'lost-manuscript', mode: 'classic', chapter: 1, stage: 'travel',
      solved: ['c1'], inventory: [], hintsUsed: {}, wrongAttempts: {}, asked: {}, notes: '',
      decision: null, team: { name: 'E2E', players: 2 }, startedAt: 1000, finishedAt: null,
      elapsedMs: 0, lastActiveAt: Date.now(),
    };
    localStorage.setItem('cityquest:progress:lost-manuscript', JSON.stringify(p));
  });
  await page.goto('/en/dashboard');
  await expect(page.getByRole('heading', { name: 'The Lost Manuscript' })).toBeVisible();

  // Simulate a fresh device: clear local storage. The reconcile on reload pulls the save back.
  await page.evaluate(() => localStorage.clear());
  await page.goto('/en/dashboard');
  await expect(page.getByRole('heading', { name: 'The Lost Manuscript' })).toBeVisible();
  await expect(page.getByText('1 of 8 chapters')).toBeVisible();
});
