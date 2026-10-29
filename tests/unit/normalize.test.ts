import { describe, expect, it } from 'vitest';
import { matchesAnswer, normalizeAnswer } from '@/lib/engine/normalize';

describe('normalizeAnswer', () => {
  it('ignores case, spaces and punctuation', () => {
    expect(normalizeAnswer('  T-O-W-E-R! ')).toBe('tower');
  });
  it('drops leading articles in English and German', () => {
    expect(normalizeAnswer('The Tower')).toBe('tower');
    expect(normalizeAnswer('der Turm')).toBe('turm');
  });
  it('folds German umlauts and ß', () => {
    expect(normalizeAnswer('Brücke')).toBe('brucke');
    expect(normalizeAnswer('Straße')).toBe('strasse');
  });
  it('handles Arabic article, harakat, tatweel and letter variants', () => {
    expect(normalizeAnswer('البرج')).toBe('برج');
    expect(normalizeAnswer('بُرْج')).toBe('برج');
    expect(normalizeAnswer('حكايـــات')).toBe('حكايات');
    expect(normalizeAnswer('حكاية')).toBe(normalizeAnswer('حكايه'));
    expect(normalizeAnswer('أحمد')).toBe('احمد');
  });
  it('turns Eastern Arabic digits into ASCII', () => {
    expect(normalizeAnswer('٧٣٤٧')).toBe('7347');
    expect(normalizeAnswer('۷۳۴۷')).toBe('7347');
  });
});

describe('matchesAnswer', () => {
  it('accepts any listed answer and rejects others', () => {
    expect(matchesAnswer('turm', ['tower', 'turm'])).toBe(true);
    expect(matchesAnswer('TOWER', ['tower', 'turm'])).toBe(true);
    expect(matchesAnswer('bridge', ['tower', 'turm'])).toBe(false);
  });
  it('never accepts an empty answer', () => {
    expect(matchesAnswer('   ', [''])).toBe(false);
    expect(matchesAnswer('!!', ['tower'])).toBe(false);
  });
});
