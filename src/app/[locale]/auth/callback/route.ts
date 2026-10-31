import { NextResponse } from 'next/server';
import { isLocale, defaultLocale } from '@/i18n/config';
import { createClient } from '@/lib/supabase/server';

/**
 * Where the magic link lands. Supabase appends a one-time `code`; we exchange it for a session (the
 * cookies are written on the redirect response) and send the player on to `next`. An invalid or expired
 * link goes back to the account page with an error flag.
 */
export async function GET(req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const nextParam = url.searchParams.get('next');
  // Only allow same-origin relative redirects, never an attacker-supplied absolute URL.
  const next = nextParam && nextParam.startsWith('/') ? nextParam : `/${locale}/account`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }

  return NextResponse.redirect(new URL(`/${locale}/account?error=callback`, url.origin));
}
