export const locales = ['de', 'en', 'nl', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

export const localeNames: Record<Locale, string> = { de: 'Deutsch', en: 'English', nl: 'Nederlands', ar: 'العربية' };
export const localeShort: Record<Locale, string> = { de: 'DE', en: 'EN', nl: 'NL', ar: 'ع' };

/** BCP 47 tags for Intl formatting. Arabic keeps Western digits, which German pricing and codes use. */
export const intlLocale: Record<Locale, string> = { de: 'de-DE', en: 'en-GB', nl: 'nl-NL', ar: 'ar-u-nu-latn' };

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/** The same path in another language: /de/adventures?x=1 -> /ar/adventures?x=1. */
export function swapLocale(pathname: string, to: Locale): string {
  const parts = pathname.split('/');
  if (isLocale(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join('/') || `/${to}`;
}
