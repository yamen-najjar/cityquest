import type { Locale } from '@/i18n/config';

/** "a, b and c" in the reader's language ("a, b of c" with type 'or'). */
export function joinList(items: string[], locale: Locale, type: 'conjunction' | 'disjunction' = 'conjunction'): string {
  return new Intl.ListFormat(locale, { style: 'long', type }).format(items);
}

/** Language codes written out in the reader's language: "Duits, Engels en Arabisch". */
export function languageList(languages: readonly Locale[], locale: Locale): string {
  const names = new Intl.DisplayNames(locale, { type: 'language' });
  return joinList(
    languages.map((l) => names.of(l) ?? l),
    locale,
  );
}

/** Groups items by a key, keeping the order in which the keys first appear. */
export function groupBy<T, K>(items: readonly T[], key: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    groups.set(k, [...(groups.get(k) ?? []), item]);
  }
  return groups;
}
