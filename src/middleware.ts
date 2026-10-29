import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale, type Locale } from '@/i18n/config';

const COOKIE = 'cq_locale';

function preferred(req: NextRequest): Locale {
  const saved = req.cookies.get(COOKIE)?.value;
  if (isLocale(saved)) return saved;
  const header = req.headers.get('accept-language') ?? '';
  for (const part of header.split(',')) {
    const tag = part.split(';')[0]?.trim().slice(0, 2).toLowerCase();
    if (isLocale(tag)) return tag;
  }
  return defaultLocale;
}

/** Every page lives under /de, /en or /ar; a path without one is sent to the visitor's language. */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const first = pathname.split('/')[1];
  if (isLocale(first)) {
    const res = NextResponse.next();
    // Remembers the last language chosen, so a bare link later opens in it. Not personal data.
    if (req.cookies.get(COOKIE)?.value !== first) {
      res.cookies.set(COOKIE, first, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    }
    return res;
  }
  const url = req.nextUrl.clone();
  url.pathname = `/${preferred(req)}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
