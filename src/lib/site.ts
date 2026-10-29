import type { Metadata } from 'next';
import { locales, type Locale } from '@/i18n/config';

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

/** Canonical and hreflang links for a path that exists in every language ("" for the home page). */
export function alternates(locale: Locale, path: string): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${siteUrl}/${l}${path}`;
  languages['x-default'] = `${siteUrl}/de${path}`;
  return { canonical: `${siteUrl}/${locale}${path}`, languages };
}

export const ogLocale: Record<Locale, string> = { de: 'de_DE', en: 'en_GB', nl: 'nl_NL', ar: 'ar_AR' };
