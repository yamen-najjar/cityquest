import { describe, expect, it } from 'vitest';
import { adventures } from '@/content/adventures';
import { filterAdventures, parseFilters } from '@/lib/catalog';
import { formatPrice, vatShare } from '@/lib/format';

describe('catalog filters', () => {
  it('drops unknown filter values', () => {
    expect(parseFilters({ theme: 'mystery', difficulty: 'insane', duration: ['short'] })).toEqual({
      q: undefined,
      city: undefined,
      theme: 'mystery',
      duration: undefined,
      difficulty: undefined,
      group: undefined,
    });
  });

  it('filters by theme, difficulty, group and duration', () => {
    const slugs = (f: Parameters<typeof filterAdventures>[1]) => filterAdventures(adventures, f).map((a) => a.slug);
    expect(slugs({ theme: 'mystery' })).toEqual(['lost-manuscript']);
    expect(slugs({ theme: 'escape' })).toEqual(['neckar-ring']);
    expect(slugs({ theme: 'detective' })).toEqual(['het-duivelshuis']);
    expect(slugs({ theme: 'treasure' })).toEqual([]);
    expect(slugs({ difficulty: 'medium', group: 'family' })).toEqual(['lost-manuscript', 'het-duivelshuis']);
    expect(slugs({ group: 'couples' })).toEqual(['lost-manuscript', 'neckar-ring', 'het-duivelshuis']);
    expect(slugs({ group: 'corporate' })).toEqual([]);
    expect(slugs({ duration: 'medium' })).toHaveLength(3);
    expect(slugs({ city: 'heidelberg' })).toHaveLength(2);
    expect(slugs({ city: 'arnhem' })).toEqual(['het-duivelshuis']);
    expect(slugs({ city: 'berlin' })).toEqual([]);
  });

  it('searches titles in every language and extra terms', () => {
    expect(filterAdventures(adventures, { q: 'manuskript' })).toHaveLength(1);
    expect(filterAdventures(adventures, { q: 'المخطوطة' })).toHaveLength(1);
    expect(filterAdventures(adventures, { q: 'خاتم' }).map((a) => a.slug)).toEqual(['neckar-ring']);
    expect(filterAdventures(adventures, { q: 'heidelberg mystery' }, (a) => ['Heidelberg', a.theme])).toHaveLength(1);
    expect(filterAdventures(adventures, { q: 'zombie' })).toHaveLength(0);
  });
});

describe('pricing', () => {
  it('formats euro prices per language', () => {
    expect(formatPrice(2490, 'de')).toMatch(/24,90\s?€/);
    expect(formatPrice(2490, 'en')).toBe('€24.90');
    expect(formatPrice(2490, 'ar')).toContain('24.90');
  });
  it('computes the VAT share of a gross price', () => {
    expect(vatShare(2490)).toBe(398);
  });
});
