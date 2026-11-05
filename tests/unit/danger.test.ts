import { describe, expect, it } from 'vitest';
import { adventures, getAdventure } from '@/content/adventures';
import { answerKeys } from '@/content/answers.server';
import { contextOf, earned } from '@/lib/engine/achievements';
import { checkAnswer } from '@/lib/engine/check.server';
import { canCatch, isFinished, isLost, LOST, newProgress, parseProgress, pressure, reduce, threatLevel, xpFor, type Mode, type Progress } from '@/lib/engine/progress';

const a = getAdventure('neckar-ring')!;
const LEVELS = a.pursuit!.levels.length;
const team = { name: 'Owls', players: 2 };

/** Solves the first `n` chapters and takes `hints` hints in the chapter after them. */
function game(mode: Mode, n: number, hints = 0): Progress {
  let p = newProgress(a.slug, team, 1, mode);
  for (const c of a.chapters.slice(0, n)) {
    p = reduce(reduce(p, { type: 'arrive' }), { type: 'solve', chapterId: c.id, reward: c.reward });
    p = reduce(p, { type: 'next', chapterCount: a.chapters.length });
  }
  const c = a.chapters[n]!;
  for (let i = 0; i < hints; i++) p = reduce(p, { type: 'hint', chapterId: c.id, available: 99 });
  return p;
}

describe('the pursuer’s danger', () => {
  it('grows one level every two hints, up to “right behind you”', () => {
    expect([0, 1, 2, 3, 4, 5, 9].map((h) => threatLevel(game('classic', 2, Math.min(h, 3)), LEVELS))).toEqual([0, 1, 1, 2, 2, 2, 2]);
    let p = game('classic', 2, 3);
    p = reduce(p, { type: 'hint', chapterId: a.chapters[2]!.id, available: 99 });
    p = reduce(p, { type: 'hint', chapterId: a.chapters[2]!.id, available: 99 });
    expect(pressure(p)).toBe(5);
    expect(threatLevel(p, LEVELS)).toBe(LEVELS - 1);
  });

  it('in expert mode (no hints) every third wrong answer feeds him instead', () => {
    let p = game('expert', 1);
    for (let i = 0; i < 6; i++) p = reduce(p, { type: 'wrong', chapterId: a.chapters[1]!.id });
    expect(pressure(p)).toBe(2);
    const classic = game('classic', 1);
    expect(pressure({ ...classic, wrongAttempts: { x: 6 } })).toBe(0);
  });

  it('never catches anyone in relaxed mode', () => {
    const p = { ...game('relaxed', 2), hintsUsed: { x: 9 } };
    expect(threatLevel(p, LEVELS)).toBe(LEVELS - 1);
    expect(canCatch(p, LEVELS)).toBe(false);
    expect(canCatch({ ...p, mode: 'classic' }, LEVELS)).toBe(true);
  });
});

describe('being caught', () => {
  const close = (): Progress => ({ ...game('classic', 3), hintsUsed: { [a.chapters[3]!.id]: 6 } });

  it('the first time he takes the newest item and falls back; winning it back returns it', () => {
    const before = close();
    const newest = before.inventory.at(-1)!;
    const p = reduce(before, { type: 'caught', now: 5 });
    expect(p.caught).toBe(1);
    expect(p.recovering).toBe(true);
    expect(p.seized).toBe(newest);
    expect(p.inventory).not.toContain(newest);
    expect(threatLevel(p, LEVELS)).toBe(1); // fell back to “on your trail”
    expect(canCatch(p, LEVELS)).toBe(false); // not while the team wins it back
    const back = reduce(p, { type: 'recover' });
    expect(back.recovering).toBe(false);
    expect(back.seized).toBeNull();
    expect(back.inventory).toContain(newest);
  });

  it('the second time the case is lost: finished, no solved-case rewards, never the top rank', () => {
    let p = reduce(reduce(close(), { type: 'caught', now: 5 }), { type: 'recover' });
    p = { ...p, hintsUsed: { ...p.hintsUsed, x: 6 } };
    expect(canCatch(p, LEVELS)).toBe(true);
    p = reduce(p, { type: 'caught', now: 9 });
    expect(isLost(p)).toBe(true);
    expect(p.decision).toBe(LOST);
    expect(isFinished(p)).toBe(true);
    expect(earned(p, contextOf(a))).not.toContain('mystery-solved');
    const solvedBonus = xpFor({ ...p, decision: 'free' }) - xpFor(p);
    expect(solvedBonus).toBe(200);
    expect(reduce(p, { type: 'caught', now: 10 })).toBe(p); // nothing after that
  });

  it('with empty pockets he takes nothing, and the case goes on', () => {
    const p = reduce({ ...newProgress(a.slug, team, 1), hintsUsed: { x: 6 } }, { type: 'caught', now: 1 });
    expect(p.seized).toBeNull();
    expect(reduce(p, { type: 'recover' }).recovering).toBe(false);
  });

  it('survives a save, and older saves start uncaught', () => {
    const p = reduce(close(), { type: 'caught', now: 5 });
    const saved = parseProgress(JSON.parse(JSON.stringify(p)), a.slug)!;
    expect([saved.caught, saved.recovering, saved.seized, saved.relief]).toEqual([1, true, p.seized, p.relief]);
    const old = JSON.parse(JSON.stringify(close())) as Record<string, unknown>;
    for (const k of ['caught', 'relief', 'seized', 'recovering']) delete old[k];
    expect(parseProgress(old, a.slug)).toMatchObject({ caught: 0, relief: 0, seized: null, recovering: false });
    expect(parseProgress({ ...old, caught: 7, relief: -3 }, a.slug)).toMatchObject({ caught: 2, relief: 0 });
  });
});

describe('the catch content', () => {
  for (const x of adventures.filter((y) => y.pursuit)) {
    it(`${x.slug}: a pursuer has a catch scene, a puzzle to win the item back (answer on the server) and a lost ending`, () => {
      const caught = x.pursuit!.caught;
      expect(caught).toBeTruthy();
      expect(caught!.recover.hints).toHaveLength(3);
      expect(answerKeys[x.slug]?.recover?.accepted.length).toBeGreaterThan(0);
      expect(caught!.lost.text.en.length).toBeGreaterThan(20);
    });
  }

  it('the server accepts the winning-back answers', () => {
    expect(checkAnswer('neckar-ring', { chapterId: 'recover', answer: 'Spiegel' })).toEqual({ ok: true, correct: true });
    expect(checkAnswer('neckar-ring', { chapterId: 'recover', answer: 'المرآة' })).toEqual({ ok: true, correct: true });
    expect(checkAnswer('het-duivelshuis', { chapterId: 'recover', answer: '42' })).toEqual({ ok: true, correct: true });
    expect(checkAnswer('het-duivelshuis', { chapterId: 'recover', answer: '24' })).toEqual({ ok: true, correct: false });
    expect(checkAnswer('lost-manuscript', { chapterId: 'recover', answer: 'x' })).toMatchObject({ ok: false, status: 404 });
  });
});
