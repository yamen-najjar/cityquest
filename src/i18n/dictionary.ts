import type { Locale } from './config';
import en from './dictionaries/en';
import de from './dictionaries/de';
import ar from './dictionaries/ar';
import nl from './dictionaries/nl';

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

/** English is the reference shape: the compiler rejects a German, Dutch or Arabic file with a key missing. */
export type Dictionary = Widen<typeof en>;

const dictionaries: Record<Locale, Dictionary> = { de, en, nl, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export { fmt } from './fmt';
