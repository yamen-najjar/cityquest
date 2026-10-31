'use client';

import { useState } from 'react';
import { subscribeAction } from '@/app/[locale]/(site)/newsletter/actions';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';

type State = 'idle' | 'invalid' | 'sending' | 'sent' | 'already' | 'unavailable' | 'error';

/**
 * Double opt-in signup: posts the address to the server, which stores it as pending and emails a
 * confirmation link. The address is only added to the list once that link is clicked.
 */
export function NewsletterForm({ t, locale }: { t: Dictionary['home']; locale: Locale }) {
  const [state, setState] = useState<State>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState('invalid');
      return;
    }
    setState('sending');
    const { status } = await subscribeAction(locale, email);
    setState(status);
    if (status === 'sent' || status === 'already') input.value = '';
  }

  const message =
    state === 'invalid' ? t.newsletterInvalid
    : state === 'sent' ? t.newsletterNotice
    : state === 'already' ? t.newsletterAlready
    : state === 'unavailable' ? t.newsletterUnavailable
    : state === 'error' ? t.newsletterError
    : '';
  const tone = state === 'invalid' || state === 'error' || state === 'unavailable' ? 'text-danger' : 'text-ivory-dim';

  return (
    <form noValidate className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
      <label htmlFor="newsletter-email" className="sr-only">
        {t.newsletterLabel}
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder={t.newsletterLabel}
        className="field sm:flex-1"
        aria-invalid={state === 'invalid'}
        aria-describedby="newsletter-status"
      />
      <button type="submit" className="btn-gold" disabled={state === 'sending'}>
        {t.newsletterButton}
      </button>
      <p id="newsletter-status" role="status" className="text-sm sm:basis-full">
        {message && <span className={tone}>{message}</span>}
      </p>
    </form>
  );
}
