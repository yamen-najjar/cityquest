import { expect, type Page } from '@playwright/test';

export async function fresh(page: Page, path: string) {
  await page.goto(path);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
}

// Located checkpoints (Phase 4) show "Confirm manually" as the always-available fallback; a checkpoint
// with no coordinates still shows "I am at the checkpoint". Match either by default.
export async function arrive(page: Page, label: string | RegExp = /Confirm manually|I am at the checkpoint/) {
  await page.getByRole('button', { name: label }).click();
}

export async function answer(page: Page, text: string) {
  await page.getByRole('textbox', { name: /answer|Antwort|إجابتك/ }).fill(text);
  await page.getByRole('button', { name: 'Check answer' }).click();
}

export async function correct(page: Page) {
  await expect(page.getByRole('heading', { name: 'Correct!' })).toBeVisible({ timeout: 10_000 });
}

export async function next(page: Page) {
  await page.getByRole('button', { name: /Next chapter|To the finale/ }).click();
}

/** Sets a number lock: the 3D dials when shown (spin buttons), otherwise the typed field. */
export async function setCode(page: Page, code: string) {
  const dial = page.getByRole('spinbutton', { name: 'Dial 1' });
  // The 3D lock loads in its own chunk: wait for it or for the typed field, whichever the page shows.
  await expect(dial.or(page.getByRole('textbox', { name: /answer|Antwort|إجابتك/ })).first()).toBeVisible({ timeout: 15_000 });
  if (await dial.count()) {
    for (let i = 0; i < code.length; i++) await page.getByRole('spinbutton', { name: `Dial ${i + 1}` }).press(code[i]!);
    await page.getByRole('button', { name: 'Check answer' }).click();
  } else {
    await answer(page, code);
  }
}

export async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}
