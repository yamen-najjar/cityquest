'use client';

import { useState } from 'react';
import type { Dictionary } from '@/i18n/dictionary';

/**
 * Validates the address and then says plainly that nothing was stored: there is no mailing list until
 * Phase 2 adds one with double opt-in, and the form must not pretend otherwise.
 */
export function NewsletterForm({ t }: { t: Dictionary['home'] }) {
  const [state, setState] = useState<'idle' | 'invalid' | 'done'>('idle');
  return (
    <form
      noValidate
      className="mt-6 flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
        setState(ok ? 'done' : 'invalid');
        if (ok) input.value = '';
      }}
    >
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
      <button type="submit" className="btn-gold">
        {t.newsletterButton}
      </button>
      <p id="newsletter-status" role="status" className="text-sm sm:basis-full">
        {state === 'invalid' && <span className="text-danger">{t.newsletterInvalid}</span>}
        {state === 'done' && <span className="text-ivory-dim">{t.newsletterNotice}</span>}
      </p>
    </form>
  );
}
