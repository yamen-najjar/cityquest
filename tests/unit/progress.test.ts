import { describe, expect, it } from 'vitest';
import { getAdventure } from '@/content/adventures';
import { contextOf, earned } from '@/lib/engine/achievements';
import {
  combinationKey,
  isFinished,
  newProgress,
  parseProgress,
  pursuitLevel,
  rankFor,
  reduce,
  starsFor,
  totalHints,
  totalStars,
  xpFor,
  type Mode,
  type Progress,
} from '@/lib/engine/progress';

const a = getAdventure('lost-manuscript')!;
const N = a.chapters.length;
const team = { name: 'Owls', players: 3 };

function playThrough(p: Progress, opts: { hints?: number; wrong?: number } = {}): Progress {
  for (const c of a.chapters) {
    p = reduce(p, { type: 'arrive' });
    for (let i = 0; i < (opts.hints ?? 0); i++) p = reduce(p, { type: 'hint', chapterId: c.id, available: c.puzzle.hints.length });
    for (let i = 0; i < (opts.wrong ?? 0); i++) p = reduce(p, { type: 'wrong', chapterId: c.id });
    p = reduce(p, { type: 'solve', chapterId: c.id, reward: c.reward });
    p = reduce(p, { type: 'next', chapterCount: N });
  }
  return p;
}
const finish = (p: Progress) => reduce(p, { type: 'decide', choiceId: 'return', chapterCount: N, now: 99 });

describe('progress reducer', () => {
  it('walks travel -> puzzle -> solved -> next chapter', () => {
    let p = newProgress(a.slug, team, 1000);
    expect(p.mode).toBe('classic');
    p = reduce(p, { type: 'arrive' });
    expect(p.stage).toBe('puzzle');
    p = reduce(p, { type: 'solve', chapterId: 'message', reward: 'torn-letter' });
    expect(p.stage).toBe('solved');
    expect(p.inventory).toEqual(['torn-letter']);
    p = reduce(p, { type: 'next', chapterCount: N });
    expect(p.chapter).toBe(1);
    expect(p.stage).toBe('travel');
  });

  it('does not advance before the chapter is solved', () => {
    let p = newProgress(a.slug, team, 0);
    p = reduce(p, { type: 'arrive' });
    expect(reduce(p, { type: 'next', chapterCount: N }).chapter).toBe(0);
  });

  it('caps hints at the number available, and gives none in expert mode', () => {
    let p = newProgress(a.slug, team, 0);
    for (let i = 0; i < 5; i++) p = reduce(p, { type: 'hint', chapterId: 'message', available: 3 });
    expect(p.hintsUsed['message']).toBe(3);
    let x = newProgress(a.slug, team, 0, 'expert');
    x = reduce(x, { type: 'hint', chapterId: 'message', available: 3 });
    expect(x.hintsUsed['message']).toBeUndefined();
  });

  it('remembers interrogation questions once each', () => {
    let p = newProgress(a.slug, team, 0);
    p = reduce(p, { type: 'ask', chapterId: 'watchman', questionId: 'ring' });
    p = reduce(p, { type: 'ask', chapterId: 'watchman', questionId: 'ring' });
    p = reduce(p, { type: 'ask', chapterId: 'watchman', questionId: 'who' });
    expect(p.asked['watchman']).toEqual(['ring', 'who']);
  });

  it('combines two carried items into a new one, and only those', () => {
    let p = newProgress(a.slug, team, 0);
    p = { ...p, inventory: ['torn-letter', 'brass-key', 'second-half'] };
    const combined = reduce(p, { type: 'combine', from: ['second-half', 'torn-letter'], to: 'whole-letter' });
    expect(combined.inventory).toEqual(['brass-key', 'whole-letter']);
    expect(reduce(p, { type: 'combine', from: ['lantern-map', 'torn-letter'], to: 'whole-letter' })).toBe(p);
    expect(combinationKey(['torn-letter', 'second-half'])).toBe('second-half+torn-letter');
    expect(a.combinations?.[0]?.from).toBe('second-half+torn-letter');
  });

  it('keeps notes, cut to the maximum length', () => {
    const p = reduce(newProgress(a.slug, team, 0), { type: 'notes', text: 'x'.repeat(5000) });
    expect(p.notes).toHaveLength(4000);
  });

  it('collects every reward and finishes only after the last chapter', () => {
    let p = newProgress(a.slug, team, 0);
    expect(reduce(p, { type: 'decide', choiceId: 'return', chapterCount: N, now: 5 }).decision).toBeNull();
    p = playThrough(p);
    expect(p.chapter).toBe(N);
    expect(p.inventory).toEqual(a.chapters.flatMap((c) => (c.reward ? [c.reward] : [])));
    p = finish(p);
    expect(isFinished(p)).toBe(true);
    expect(p.finishedAt).toBe(99);
  });

  it('counts playing time but not long breaks', () => {
    let p = newProgress(a.slug, team, 0);
    p = reduce(p, { type: 'tick', now: 60_000 });
    p = reduce(p, { type: 'tick', now: 60_000 + 3 * 60 * 60 * 1000 });
    p = reduce(p, { type: 'tick', now: 60_000 + 3 * 60 * 60 * 1000 + 30_000 });
    expect(p.elapsedMs).toBe(90_000);
  });

  it('clamps the team to 1-5 players', () => {
    expect(newProgress(a.slug, { name: 'x', players: 9 }, 0).team.players).toBe(5);
    expect(newProgress(a.slug, { name: 'x', players: 0 }, 0).team.players).toBe(1);
  });
});

describe('stars, ranks and experience', () => {
  it('gives three stars for a clean chapter, two for a little help, one otherwise', () => {
    const clean = playThrough(newProgress(a.slug, team, 0));
    expect(starsFor(clean, 'message')).toBe(3);
    const oneHint = playThrough(newProgress(a.slug, team, 0), { hints: 1 });
    expect(starsFor(oneHint, 'message')).toBe(2);
    const struggled = playThrough(newProgress(a.slug, team, 0), { hints: 2 });
    expect(starsFor(struggled, 'message')).toBe(1);
    expect(starsFor(newProgress(a.slug, team, 0), 'message')).toBe(0);
    expect(totalStars(clean)).toBe(N * 3);
  });

  it('ranks by the share of stars', () => {
    expect(rankFor(24, 8)).toBe(3);
    expect(rankFor(17, 8)).toBe(2);
    expect(rankFor(11, 8)).toBe(1);
    expect(rankFor(8, 8)).toBe(0);
  });

  it('scores experience by mode: hints cost only in classic, experts earn a bigger bonus', () => {
    const run = (mode: Mode, hints = 0) => finish(playThrough(newProgress(a.slug, team, 0, mode), { hints }));
    expect(xpFor(run('classic'))).toBe(N * (100 + 75) + 200);
    expect(xpFor(run('classic', 1))).toBe(N * (85 + 50) + 200);
    expect(xpFor(run('relaxed', 1))).toBe(N * (100 + 50) + 200);
    expect(xpFor(run('expert'))).toBe(N * (100 + 75) + 300);
    expect(totalHints(run('classic', 1))).toBe(N);
  });

  it('moves a pursuer one level closer for every two hints', () => {
    expect([0, 1, 2, 3, 4, 5, 9].map((h) => pursuitLevel(h, 4))).toEqual([0, 1, 1, 2, 2, 3, 3]);
  });

  it('awards achievements from what was played', () => {
    const done = finish(playThrough(newProgress(a.slug, team, 0)));
    expect(earned(done, contextOf(a))).toEqual(['first-clue', 'codebreaker', 'clear-thinker', 'mystery-solved', 'no-hints', 'heidelberg-explorer']);
    let wrong = newProgress(a.slug, team, 0);
    wrong = reduce(wrong, { type: 'wrong', chapterId: 'witnesses' });
    wrong = reduce(wrong, { type: 'solve', chapterId: 'witnesses' });
    expect(earned(wrong, contextOf(a))).toEqual(['first-clue']);
  });
});

describe('parseProgress', () => {
  it('round-trips a saved game', () => {
    const p = playThrough(newProgress(a.slug, team, 0, 'expert'));
    expect(parseProgress(JSON.parse(JSON.stringify(p)), a.slug)).toEqual(p);
  });
  it('rejects other adventures, old versions and junk', () => {
    const p = newProgress(a.slug, team, 0);
    expect(parseProgress(p, 'other')).toBeNull();
    expect(parseProgress({ ...p, version: 1 }, a.slug)).toBeNull();
    expect(parseProgress({ ...p, stage: 'flying' }, a.slug)).toBeNull();
    expect(parseProgress('nope', a.slug)).toBeNull();
    expect(parseProgress(null, a.slug)).toBeNull();
  });
  it('repairs a missing or unknown mode', () => {
    const p = newProgress(a.slug, team, 0);
    expect(parseProgress({ ...p, mode: 'godlike' }, a.slug)?.mode).toBe('classic');
  });
});
