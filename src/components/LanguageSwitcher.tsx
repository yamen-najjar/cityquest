'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { localeNames, localeShort, locales, swapLocale, type Locale } from '@/i18n/config';

/**
 * Links to the same page in the other languages. Game progress is stored per adventure, not per
 * language, so switching in the middle of a chapter carries on where the player was.
 */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() || `/${locale}`;
  const router = useRouter();
  return (
    <nav aria-label={label} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
      {locales.map((l) => {
        const href = swapLocale(pathname, l);
        const active = l === locale;
        return (
          <Link
            key={l}
            href={href}
            hrefLang={l}
            lang={l}
            aria-current={active ? 'true' : undefined}
            title={localeNames[l]}
            onClick={(e) => {
              // Keep the catalogue filters (the query string) when changing language.
              const search = window.location.search;
              if (search) {
                e.preventDefault();
                router.push(href + search);
              }
            }}
            className={`min-w-[40px] rounded-full px-2.5 py-1.5 text-center text-xs font-semibold transition ${
              active ? 'bg-gold text-navy' : 'text-ivory-dim hover:text-ivory'
            }`}
          >
            <span aria-hidden="true">{localeShort[l]}</span>
            <span className="sr-only">{localeNames[l]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
