'use server';
import { redirect } from 'next/navigation';
import { confirmByToken, subscribe, unsubscribeByToken, type SubscribeResult } from '@/lib/newsletter/subscribe.server';
import { isLocale } from '@/i18n/config';

export async function subscribeAction(locale: string, email: string): Promise<SubscribeResult> {
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
  if (mode === 'confirm') {
    const r = await confirmByToken(token);
    done = r === 'ok' ? 'confirmed' : r === 'already' ? 'already' : 'invalid';
  } else if (mode === 'unsubscribe') {
    const r = await unsubscribeByToken(token);
    done = r === 'ok' || r === 'already' ? 'unsubscribed' : 'invalid';
  }
  redirect(`/${locale}/newsletter?done=${done}`);
}
