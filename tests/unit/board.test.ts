import { describe, expect, it } from 'vitest';
import { adventures, getAdventure } from '@/content/adventures';
import { answerKeys } from '@/content/answers.server';
import type { Adventure } from '@/content/types';
import { contextOf, earned } from '@/lib/engine/achievements';
import { boardAnswer, evidenceCards, peopleMet, visibleQuestions } from '@/lib/engine/board';
import { checkAnswer } from '@/lib/engine/check.server';
import { newProgress, parseProgress, reduce, xpFor, type Progress } from '@/lib/engine/progress';

const team = { name: 'Owls', players: 2 };

/** Plays up to and including chapter `lastId` (asking every interview question), and stops on its success screen. */
function playUntil(a: Adventure, lastId: string): Progress {
  let p = newProgress(a.slug, team, 1000);
  for (const c of a.chapters) {
    p = reduce(p, { type: 'arrive' });
    for (const q of c.puzzle.interview?.questions ?? []) p = reduce(p, { type: 'ask', chapterId: c.id, questionId: q.id });
    p = reduce(p, { type: 'solve', chapterId: c.id, reward: c.reward });
    if (c.id === lastId) return p;
    p = reduce(p, { type: 'next', chapterCount: a.chapters.length });
  }
  throw new Error(`no chapter ${lastId}`);
}

const withBoard = adventures.filter((a) => a.board?.length);

describe('evidence board content', () => {
  it('exists for at least one adventure', () => {
    expect(withBoard.map((a) => a.slug)).toContain('lost-manuscript');
  });

  for (const a of withBoard) {
    describe(a.slug, () => {
      it('has unique questions tied to real chapters, each with an answer key', () => {
        const ids = a.board!.map((q) => q.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const q of a.board!) {
          expect(a.chapters.some((c) => c.id === q.after), q.id).toBe(true);
          expect(answerKeys[a.slug]?.[`board:${q.id}`]?.accepted.length, q.id).toBeGreaterThan(0);
        }
      });

      it('every accepted answer can be given with what the team holds when the question appears', () => {
        for (const q of a.board!) {
          const p = playUntil(a, q.after);
          const people = peopleMet(a, p).map((x) => x.id);
          const cards = evidenceCards(a, p).map((c) => c.id);
          for (const answer of answerKeys[a.slug]![`board:${q.id}`]!.accepted) {
            const [person, pinned] = answer.split('|') as [string, string];
            const parts = pinned.split('+');
            expect(parts, answer).toHaveLength(2);
            expect(people, `${q.id}: ${person} not met yet`).toContain(person);
            for (const card of parts) expect(cards, `${q.id}: ${card} not held yet`).toContain(card);
          }
        }
      });
    });
  }
});

describe('evidence board rules', () => {
  const a = getAdventure('lost-manuscript')!;

  it('shows a question only once its chapter is solved, so later ones are never spoiled', () => {
    expect(visibleQuestions(a, newProgress(a.slug, team, 1)).map((q) => q.id)).toEqual([]);
    expect(visibleQuestions(a, playUntil(a, 'witnesses')).map((q) => q.id)).toEqual(['liar']);
    expect(visibleQuestions(a, playUntil(a, 'chest')).map((q) => q.id)).toEqual(['liar', 'who-is-k', 'footprints']);
  });

  it('only offers evidence that has been found', () => {
    const cards = evidenceCards(a, playUntil(a, 'witnesses')).map((c) => c.id);
    expect(cards).toContain('item:brass-key');
    expect(cards).not.toContain('clue:study-0');
  });

  it('writes answers independent of pin order', () => {
    expect(boardAnswer('kehl', ['item:x', 'clue:y'])).toBe(boardAnswer('kehl', ['clue:y', 'item:x']));
  });

  it('records a deduction once, adds experience, and unlocks Sharp eye when the board is complete', () => {
    let p = playUntil(a, 'mirror');
    const before = xpFor(p);
    p = reduce(p, { type: 'deduce', questionId: 'liar' });
    p = reduce(p, { type: 'deduce', questionId: 'liar' });
    expect(p.deductions).toEqual(['liar']);
    expect(xpFor(p)).toBe(before + 30);
    expect(earned(p, contextOf(a))).not.toContain('sharp-eye');
    for (const q of a.board!) p = reduce(p, { type: 'deduce', questionId: q.id });
    expect(earned(p, contextOf(a))).toContain('sharp-eye');
  });

  it('keeps deductions through a save, and gives older saves an empty board', () => {
    const p = reduce(playUntil(a, 'witnesses'), { type: 'deduce', questionId: 'liar' });
    expect(parseProgress(JSON.parse(JSON.stringify(p)), a.slug)?.deductions).toEqual(['liar']);
    const old = JSON.parse(JSON.stringify(p)) as Record<string, unknown>;
    delete old.deductions;
    expect(parseProgress(old, a.slug)?.deductions).toEqual([]);
  });
});

describe('checking board answers on the server', () => {
  const check = (chapterId: string, answer: string) => checkAnswer('lost-manuscript', { chapterId, answer });

  it('accepts the right person with the right evidence, in any order', () => {
    expect(check('board:liar', boardAnswer('anna', ['clue:witnesses-0', 'item:brass-key']))).toEqual({ ok: true, correct: true });
    expect(check('board:signal', boardAnswer('vii', ['clue:mirror-0', 'clue:signal-0']))).toEqual({ ok: true, correct: true });
  });

  it('rejects the wrong person or the wrong evidence', () => {
    expect(check('board:liar', boardAnswer('ben', ['clue:witnesses-0', 'item:brass-key']))).toEqual({ ok: true, correct: false });
    expect(check('board:footprints', boardAnswer('kehl', ['clue:chest-0', 'item:brass-key']))).toEqual({ ok: true, correct: false });
  });

  it('refuses unknown board questions', () => {
    expect(check('board:nope', 'x|y+z')).toMatchObject({ ok: false, status: 404 });
  });
});
