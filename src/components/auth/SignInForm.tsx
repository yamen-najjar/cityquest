'use client';

import { useState, type FormEvent } from 'react';
import type { Locale } from '@/i18n/config';
import { fmt, type Dictionary } from '@/i18n/dictionary';
import { createClient } from '@/lib/supabase/client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignInForm({ locale, t }: { locale: Locale; t: Dictionary['account'] }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError(t.invalidEmail);
      setStatus('error');
      return;
    }
    setStatus('sending');
    setError('');
    const supabase = createClient();
    const next = `/${locale}/account`;
    const emailRedirectTo = `${window.location.origin}/${locale}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error: sendError } = await supabase.auth.signInWithOtp({ email: value, options: { emailRedirectTo } });
    if (sendError) {
      setError(t.sendError);
      setStatus('error');
      return;
    }
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <div className="card p-8">
        <h2 className="font-display text-2xl font-semibold text-gold">{t.sentTitle}</h2>
        <p className="mt-3 text-ivory-dim">{fmt(t.sentText, { email: email.trim() })}</p>
        <button
          type="button"
          className="btn-ghost mt-6"
          onClick={() => {
            setStatus('idle');
            setEmail('');
          }}
        >
          {t.resend}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-8" noValidate>
      <h2 className="font-display text-2xl font-semibold">{t.signInTitle}</h2>
      <p className="mt-2 text-sm text-ivory-dim">{t.signInText}</p>
      <label htmlFor="signin-email" className="mt-6 block text-sm font-medium">
        {t.emailLabel}
      </label>
      <input
        id="signin-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === 'error') setStatus('idle');
        }}
        placeholder={t.emailPlaceholder}
        aria-invalid={status === 'error' || undefined}
        aria-describedby={error ? 'signin-error' : undefined}
        className="mt-2 w-full rounded-xl border border-white/10 bg-navy-800 px-4 py-3 text-ivory outline-none focus:border-gold"
        dir="ltr"
      />
      {error && (
        <p id="signin-error" role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
      <button type="submit" className="btn-gold mt-5 w-full" disabled={status === 'sending'}>
        {status === 'sending' ? t.sending : t.sendLink}
      </button>
    </form>
  );
}
