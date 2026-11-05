import { describe, expect, it } from 'vitest';
import { adventures, getAdventure } from '@/content/adventures';
import { daysUntil, LETTER_DELAY_MS, letterAt, tokenEarned } from '@/lib/engine/meta';
import { canCatch, gentle, LOST, MODES, newProgress, type Progress } from '@/lib/engine/progress';

const a = getAdventure('lost-manuscript')!;
const secrets = a.secrets!.map((s) => s.id);
const finished = (extra: Partial<Progress> = {}): Progress => ({
  ...newProgress(a.slug, { name: 'Owls', players: 2 }, 1),
  chapter: a.chapters.length,
  solved: a.chapters.map((c) => c.id),
  decision: 'return',
  finishedAt: 1_000,
  ...extra,
});

describe('the lantern signs', () => {
  it('are won by solving the case with every secret found, never by a lost case', () => {
    expect(tokenEarned(finished({ secrets }), secrets)).toBe(true);
    expect(tokenEarned(finished({ secrets: secrets.slice(1) }), secrets)).toBe(false);
    expect(tokenEarned({ ...finished({ secrets }), decision: null, finishedAt: null }, secrets)).toBe(false);
    expect(tokenEarned(finished({ secrets, decision: LOST, caught: 2 }), secrets)).toBe(false);
  });
  it('every story hides one, in its own place in the sentence', () => {
    const orders = adventures.map((s) => s.token!.order).sort();
    expect(orders).toEqual([...new Set(orders)]);
    expect(adventures.map((s) => s.token!.fragment.en).join(' ')).toBe('What is kept is never lost while someone reads.');
  });
});

describe('the letter a week later', () => {
  it('arrives seven days after the case is solved; a lost case gets none', () => {
    expect(letterAt(finished())).toBe(1_000 + LETTER_DELAY_MS);
    expect(letterAt({ ...finished(), decision: null, finishedAt: null })).toBeNull();
    expect(letterAt(finished({ decision: LOST, caught: 2 }))).toBeNull();
    expect(daysUntil(1_000 + LETTER_DELAY_MS, 1_000)).toBe(7);
    expect(daysUntil(1_000 + LETTER_DELAY_MS, 1_000 + LETTER_DELAY_MS - 1)).toBe(1);
  });
});

describe('junior mode', () => {
  it('is a mode of its own: hints free, the pursuer never catches, every puzzle explained', () => {
    expect(MODES[0]).toBe('junior');
    expect(gentle('junior') && gentle('relaxed') && !gentle('classic')).toBe(true);
    const p = { ...newProgress(a.slug, { name: 'Kids', players: 3 }, 1, 'junior'), hintsUsed: { message: 3, witnesses: 3, clockmaker: 3 } };
    expect(canCatch(p, 4)).toBe(false);
    for (const s of adventures) expect(s.chapters.every((c) => c.puzzle.junior?.en)).toBe(true);
  });
});
