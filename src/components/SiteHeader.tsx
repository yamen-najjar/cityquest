'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { LanguageSwitcher } from './LanguageSwitcher';
import { RouteMark } from './Logo';

export function SiteHeader({ locale, nav }: { locale: Locale; nav: Dictionary['nav'] }) {
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [pathname]);

  // Escape closes the menu and hands focus back to the button that opened it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Auth state is read in the browser so the site pages stay statically rendered (no per-request cookie
  // read in the layout). The label updates live on sign-in and sign-out without a full navigation.
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    try {
      const supabase = createClient();
      const { data } = supabase.auth.onAuthStateChange((_event, session) => setAuthed(!!session));
      return () => data.subscription.unsubscribe();
    } catch {
      /* leave signed-out */
    }
  }, []);

  const links = [
    { href: `/${locale}/cities`, label: nav.cities },
    { href: `/${locale}/adventures`, label: nav.adventures },
    { href: `/${locale}/dashboard`, label: nav.myAdventures },
    { href: `/${locale}/account`, label: authed ? nav.account : nav.signIn },
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="tp-header">
      <div className="tp-wrap tp-header__bar">
        <Link href={`/${locale}`} className="tp-brand" aria-label={`CityQuest – ${nav.home}`}>
          <RouteMark />
          <span dir="ltr">CityQuest</span>
        </Link>

        <nav aria-label={nav.mainNav} className="tp-nav">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isActive(l.href) ? 'page' : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="tp-header__tools">
          <div className="tp-header__lang">
            <LanguageSwitcher locale={locale} label={nav.language} variant="site" />
          </div>
          <button ref={toggleRef} type="button" className="tp-menu-button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            <span className="sr-only">{open ? nav.close : nav.menu}</span>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="tp-mobile-menu" hidden={!open}>
          <nav aria-label={nav.mainNav} className="tp-wrap">
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} aria-current={isActive(l.href) ? 'page' : undefined}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="tp-mobile-menu__lang">
              <LanguageSwitcher locale={locale} label={nav.language} variant="site" />
            </div>
          </nav>
        </div>
    </header>
  );
}
