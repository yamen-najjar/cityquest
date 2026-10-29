import { describe, expect, it } from 'vitest';
import { adventures } from '@/content/adventures';
import { cities } from '@/content/cities';
import { missingTranslations } from '@/content/translations';
import { locales, swapLocale } from '@/i18n/config';
import { fmt, getDictionary } from '@/i18n/dictionary';

/** Every leaf path of an object, e.g. "home.how.0.title". */
function paths(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k));
}

describe('dictionaries', () => {
  it('have the same keys in German, English and Arabic', () => {
    const en = paths(getDictionary('en')).sort();
    expect(paths(getDictionary('de')).sort()).toEqual(en);
    expect(paths(getDictionary('nl')).sort()).toEqual(en);
    expect(paths(getDictionary('ar')).sort()).toEqual(en);
  });

  it('have no empty strings', () => {
    for (const l of locales) {
      const d = getDictionary(l);
      for (const p of paths(d)) {
        const v = p.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], d);
        expect(typeof v === 'string' && v.trim().length > 0, `${l}:${p}`).toBe(true);
      }
    }
  });

  it('keep the same placeholders in every language', () => {
    const en = getDictionary('en');
    for (const l of ['de', 'nl', 'ar'] as const) {
      const d = getDictionary(l);
      for (const p of paths(en)) {
        const get = (o: unknown) => p.split('.').reduce<unknown>((x, k) => (x as Record<string, unknown>)[k], o) as string;
        const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
        expect(vars(get(d)), `${l}:${p}`).toEqual(vars(get(en)));
      }
    }
  });
});

describe('content translations', () => {
  /** Every { de, en, ar } object in the content must have all three filled in. */
  function checkLocalized(node: unknown, where: string) {
    if (Array.isArray(node)) return node.forEach((n, i) => checkLocalized(n, `${where}[${i}]`));
    if (!node || typeof node !== 'object') return;
    const o = node as Record<string, unknown>;
    if ('de' in o && 'en' in o && 'ar' in o) {
      for (const l of locales) {
        const v = o[l];
        const ok = typeof v === 'string' ? v.trim().length > 0 : Array.isArray(v) && v.length > 0;
        expect(ok, `${where}.${l}`).toBe(true);
      }
      return;
    }
    for (const [k, v] of Object.entries(o)) checkLocalized(v, `${where}.${k}`);
  }

  it('are complete for every adventure and city', () => {
    adventures.forEach((a) => checkLocalized(a, a.slug));
    cities.forEach((c) => checkLocalized(c, c.slug));
  });

  it('have a Dutch translation for every English text (nothing falls back to English)', () => {
    expect(missingTranslations.nl).toEqual([]);
  });

  it('give Dutch its own puzzle material where the puzzle depends on the language', () => {
    const lm = adventures.find((a) => a.slug === 'lost-manuscript')!;
    expect(lm.chapters.find((c) => c.id === 'message')!.puzzle.material!.nl).toEqual(['20 · 15 · 18 · 5 · 14']);
    expect(lm.chapters.find((c) => c.id === 'mirror')!.puzzle.material!.nl).toEqual(['N E L A H R E V']);
    const nr = adventures.find((a) => a.slug === 'neckar-ring')!;
    expect(nr.chapters.find((c) => c.id === 'whispers')!.puzzle.material!.nl).toEqual(['Zoek wie boeken bindt.']);
    // The scene subtitles are translated too.
    const line = nr.chapters.find((c) => c.id === 'box')!.scenes!.intro!.lines![0]!;
    expect(line.text.nl).toBe('Dit is van jou. Het heeft lang op je gewacht.');
  });
});

describe('helpers', () => {
  it('swapLocale keeps the rest of the path', () => {
    expect(swapLocale('/de/adventures/lost-manuscript', 'ar')).toBe('/ar/adventures/lost-manuscript');
    expect(swapLocale('/en', 'de')).toBe('/de');
    expect(swapLocale('/adventures', 'en')).toBe('/en/adventures');
  });
  it('fmt fills placeholders', () => {
    expect(fmt('{n} of {total}', { n: 2, total: 5 })).toBe('2 of 5');
    expect(fmt('{missing}', {})).toBe('{missing}');
  });
});
