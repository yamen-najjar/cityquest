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
  // Resolve `next` against our origin and accept it only if it stays on this origin and points at a
  // localized path. This rejects `//evil.com` and `/\evil.com`, which both slip past a bare startsWith('/').
  const target = new URL(url.searchParams.get('next') ?? '', url.origin);
  const safeNext =
    target.origin === url.origin && /^\/(de|en|nl|ar)(\/|$)/.test(target.pathname) ? target.pathname + target.search : `/${locale}/account`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(safeNext, url.origin));
  }

  return NextResponse.redirect(new URL(`/${locale}/account?error=callback`, url.origin));
}
