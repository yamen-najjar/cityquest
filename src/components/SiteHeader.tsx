'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LogoMark } from './Logo';

export function SiteHeader({ locale, nav }: { locale: Locale; nav: Dictionary['nav'] }) {
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: `/${locale}/cities`, label: nav.cities },
    { href: `/${locale}/adventures`, label: nav.adventures },
    { href: `/${locale}/dashboard`, label: nav.myAdventures },
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-navy/85 backdrop-blur-md">
      <div className="container-cq flex h-16 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-2.5" aria-label={`CityQuest – ${nav.home}`}>
          <LogoMark />
          <span className="font-display text-xl font-semibold tracking-wide" dir="ltr">
            City<span className="text-gold">Quest</span>
          </span>
        </Link>

        <nav aria-label={nav.mainNav} className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-sm transition ${
                isActive(l.href) ? 'text-gold' : 'text-ivory-dim hover:text-ivory'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher locale={locale} label={nav.language} />
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? nav.close : nav.menu}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-white/5 bg-navy md:hidden">
          <nav aria-label={nav.mainNav} className="container-cq flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? 'page' : undefined}
                className={`rounded-xl px-4 py-3 text-base ${isActive(l.href) ? 'bg-gold/10 text-gold' : 'text-ivory'}`}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 px-1 sm:hidden">
              <LanguageSwitcher locale={locale} label={nav.language} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
