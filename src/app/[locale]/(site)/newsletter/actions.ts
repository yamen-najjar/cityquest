'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { confirmByToken, subscribe, unsubscribeByToken, type SubscribeResult } from '@/lib/newsletter/subscribe.server';
import { isLocale } from '@/i18n/config';
import { clientKey, createLimiter } from '@/lib/rate-limit';

// Every sign-up sends an email, so one address may not trigger many in a row. The per-email cooldown in
// subscribe() stops repeats to one inbox; this stops one sender spraying many different inboxes.
const signups = createLimiter(5, 10 * 60_000);
const tokenActions = createLimiter(20, 10 * 60_000);

export async function subscribeAction(locale: string, email: string): Promise<SubscribeResult> {
  if (!signups.hit(clientKey(await headers())).ok) return { status: 'unavailable' };
  return subscribe(email, locale);
}

/**
 * Confirm or unsubscribe, triggered by the button on the newsletter page (a POST), never by loading a
 * link — so an email scanner that prefetches the link only renders the page, it cannot change state.
 * Redirects back to the page with the outcome.
 */
export async function performNewsletterAction(formData: FormData): Promise<void> {
  const token = String(formData.get('token') ?? '');
  const mode = String(formData.get('mode') ?? '');
  const localeRaw = String(formData.get('locale') ?? '');
  const locale = isLocale(localeRaw) ? localeRaw : 'de';

  let done = 'invalid';
  // Tokens are random UUIDs, so guessing is hopeless anyway; the limit just keeps scripts off the database.
  if (!tokenActions.hit(clientKey(await headers())).ok) redirect(`/${locale}/newsletter?done=invalid`);
  if (mode === 'confirm') {
    const r = await confirmByToken(token);
    done = r === 'ok' ? 'confirmed' : r === 'already' ? 'already' : 'invalid';
  } else if (mode === 'unsubscribe') {
    const r = await unsubscribeByToken(token);
    done = r === 'ok' || r === 'already' ? 'unsubscribed' : 'invalid';
  }
  redirect(`/${locale}/newsletter?done=${done}`);
}
