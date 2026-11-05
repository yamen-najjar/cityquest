import { describe, expect, it } from 'vitest';
import { adventures, getAdventure } from '@/content/adventures';
import { checkAnswer } from '@/lib/engine/check.server';
import { inbox } from '@/lib/engine/kit';
import { newProgress, parseProgress } from '@/lib/engine/progress';
import { applyVariant, nextVariant, variantOf } from '@/lib/engine/variant';

const OFF = new Date(2026, 5, 15);

describe('second truths', () => {
  it('every story has one, and a replay cycles original → variant → original', () => {
    for (const a of adventures) {
      const id = a.variants![0]!.id;
      expect(nextVariant(a, null)).toBe(id);
      expect(nextVariant(a, id)).toBeNull();
      expect(nextVariant(a, 'unknown')).toBeNull();
    }
  });

  it('a variant retells the story: new clues, changed texts, notes, ending; the original is untouched', () => {
    const a = getAdventure('lost-manuscript')!;
    const v = applyVariant(a, 'anna');
    expect(v.appliedVariant).toBe('anna');
    const verdict = v.chapters.find((c) => c.id === 'verdict')!;
    expect(verdict.puzzle.hints[2]!.en).toBe('Anna, with the brass key.');
    expect(verdict.scenes?.success).toBeUndefined(); // the original cutscenes would tell the wrong truth
    expect(verdict.scenes?.intro).toBeUndefined();
    expect(v.chapters.find((c) => c.id === 'study')!.scenes).toBe(a.chapters.find((c) => c.id === 'study')!.scenes ?? undefined);
    expect(v.ending.reveal.en.join(' ')).toContain('Anna was ready to sell it');
    expect(v.people.find((p) => p.id === 'anna')!.notes!.at(-1)!.text.en).toContain('Forced the back door');
    expect(v.phone!.find((m) => m.id === 'kehl-sorry')!.text.en).toContain('ever wanted to buy it');
    const all = { ...newProgress(a.slug, { name: 'X', players: 2 }, 1), solved: a.chapters.map((c) => c.id) };
    expect(inbox(v, all, OFF).map((m) => m.id)).toEqual(expect.arrayContaining(['ben-anna', 'clara-river']));
    expect(inbox(a, all, OFF).map((m) => m.id)).not.toContain('ben-anna');
    expect(a.chapters.find((c) => c.id === 'verdict')!.puzzle.hints[2]!.en).toContain('Kehl');
    expect(applyVariant(a, 'nope')).toBe(a);
    expect(applyVariant(a, null)).toBe(a);
  });

  it('the server grades each truth by its own key, and refuses an unknown one', () => {
    const lm = (body: object) => checkAnswer('lost-manuscript', body);
    expect(lm({ chapterId: 'verdict', answer: 'kehl+whole-letter' })).toMatchObject({ correct: true });
    expect(lm({ chapterId: 'verdict', answer: 'kehl+whole-letter', variant: 'anna' })).toMatchObject({ correct: false });
    expect(lm({ chapterId: 'verdict', answer: 'anna+brass-key', variant: 'anna' })).toMatchObject({ correct: true });
    expect(lm({ chapterId: 'verdict', answer: 'anna+brass-key' })).toMatchObject({ correct: false });
    // Answers that do not change fall back to the original's.
    expect(lm({ chapterId: 'message', answer: 'tower', variant: 'anna' })).toMatchObject({ correct: true });
    expect(lm({ chapterId: 'verdict', answer: 'x', variant: 'kaspar' })).toMatchObject({ ok: false, status: 400 });
    expect(lm({ chapterId: 'verdict', answer: 'x', variant: 7 })).toMatchObject({ ok: false, status: 400 });

    const arnhem = (answer: string, variant?: string) => checkAnswer('het-duivelshuis', { chapterId: 'aanklacht', answer, variant });
    expect(arnhem('devries+iron-key', 'saar')).toMatchObject({ correct: true });
    expect(arnhem('koster+whole-ledger', 'saar')).toMatchObject({ correct: false });

    const ring = (answer: string, variant?: string) => checkAnswer('neckar-ring', { chapterId: 'report', answer, variant });
    expect(ring('how=free-will;name=valen;weakness=dry;who=kaspar;why=fear', 'kaspar')).toMatchObject({ correct: true });
    expect(ring('how=free-will;name=valen;weakness=dry;who=hedda;why=fear', 'kaspar')).toMatchObject({ correct: false, confirmed: ['how', 'name', 'weakness', 'why'] });
    expect(ring('how=free-will;name=valen;weakness=dry;who=hedda;why=fear')).toMatchObject({ correct: true });
  });

  it('a save remembers its truth; nonsense is dropped', () => {
    const a = getAdventure('neckar-ring')!;
    const p = newProgress(a.slug, { name: 'X', players: 2 }, 1, 'classic', 'kaspar');
    expect(parseProgress(JSON.parse(JSON.stringify(p)), a.slug)!.variant).toBe('kaspar');
    expect(parseProgress({ ...p, variant: '<script>' }, a.slug)!.variant).toBeNull();
    expect(variantOf(a, 'kaspar')!.culprit).toBe('kaspar');
  });
});
