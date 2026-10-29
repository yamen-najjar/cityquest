import type { Authored } from '../types';
import { nl } from './nl';

/** English texts that have no translation yet, per added language. The tests require it to be empty. */
export const missingTranslations: Record<string, string[]> = { nl: [] };

const tables = { nl };

/**
 * Adds the languages that are not written into the content files, by looking up each English text in
 * that language's table. A text with no entry falls back to English and is listed in missingTranslations.
 */
export function localize<T>(src: Authored<T>): T {
  const walk = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(walk);
    if (!node || typeof node !== 'object') return node;
    const o = node as Record<string, unknown>;
    if ('de' in o && 'en' in o && 'ar' in o) {
      const out: Record<string, unknown> = { ...o };
      for (const [lang, table] of Object.entries(tables) as [keyof typeof tables, Record<string, string>][]) {
        if (lang in o) continue;
        const tr = (en: string) => {
          const hit = table[en];
          if (hit === undefined && !missingTranslations[lang]!.includes(en)) missingTranslations[lang]!.push(en);
          return hit ?? en;
        };
        out[lang] = Array.isArray(o.en) ? (o.en as string[]).map(tr) : typeof o.en === 'string' ? tr(o.en) : o.en;
      }
      return out;
    }
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, walk(v)]));
  };
  return walk(src) as T;
}
