import { intlLocale, type Locale } from '@/i18n/config';

export function formatPrice(cents: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale], { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

export function formatNumber(n: number, locale: Locale, digits = 0): string {
  return new Intl.NumberFormat(intlLocale[locale], { maximumFractionDigits: digits }).format(n);
}

export function formatDuration(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** German consumer prices include 19 % VAT; this is the share of the gross price that is VAT. */
export function vatShare(cents: number, rate = 0.19): number {
  return Math.round(cents - cents / (1 + rate));
}
