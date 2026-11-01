// Regression tests for the stability pass: damaged saves, the device store, restarts and rate limiting.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getAdventure } from '@/content/adventures';
import { fitToAdventure, MAX_NOTES, newProgress, parseProgress, reduce, type Progress } from '@/lib/engine/progress';
import { clearAllLocalProgress, localProgressStore, pendingRestarts } from '@/lib/engine/storage';
import { clientKey, createLimiter } from '@/lib/rate-limit';

const a = getAdventure('lost-manuscript')!;
const chapterIds = a.chapters.map((c) => c.id);
const itemIds = a.items.map((i) => i.id);
const N = chapterIds.length;
const team = { name: 'Owls', players: 3 };

/** A save with the first `n` chapters solved and the player at the next checkpoint. */
function solvedThrough(n: number): Progress {
  let p = newProgress(a.slug, team, 1000);
  for (const c of a.chapters.slice(0, n)) {
    p = reduce(p, { type: 'arrive' });
    p = reduce(p, { type: 'solve', chapterId: c.id, reward: c.reward });
    p = reduce(p, { type: 'next', chapterCount: N });
  }
  return p;
}

describe('parseProgress repairs damaged fields instead of crashing the game', () => {
  const good = solvedThrough(2);
  const json = () => JSON.parse(JSON.stringify(good)) as Record<string, unknown>;

  it('refuses a save whose core is broken', () => {
    for (const chapter of [-1, 1.5, Number.NaN, Infinity, '2', 10_000]) {
      expect(parseProgress({ ...json(), chapter }, a.slug), String(chapter)).toBeNull();
    }
    expect(parseProgress({ ...json(), team: null }, a.slug)).toBeNull();
    expect(parseProgress({ ...json(), solved: 'clara' }, a.slug)).toBeNull();
    expect(parseProgress([], a.slug)).toBeNull();
  });

  it('repairs wrong types field by field', () => {
    const p = parseProgress(
      {
        ...json(),
        solved: ['message', 'message', 42, null, 'witnesses'],
        inventory: [{}, 'torn-letter'],
        hintsUsed: 'lots',
        wrongAttempts: { message: -3, witnesses: 2.5, clockmaker: 1 },
        asked: { message: 'q1', witnesses: ['a', 7, 'a'] },
        notes: 12,
        decision: { pick: 'x' },
        team: { name: 'Owls', players: 99 },
        elapsedMs: -5,
        finishedAt: 'yesterday',
        lastActiveAt: Number.NaN,
      },
      a.slug,
    )!;
    expect(p.solved).toEqual(['message', 'witnesses']);
    expect(p.inventory).toEqual(['torn-letter']);
    expect(p.hintsUsed).toEqual({});
    expect(p.wrongAttempts).toEqual({ clockmaker: 1 });
    expect(p.asked).toEqual({ message: [], witnesses: ['a'] });
    expect(p.notes).toBe('');
    expect(p.decision).toBeNull();
    expect(p.team.players).toBe(5);
    expect(p.elapsedMs).toBe(0);
    expect(p.finishedAt).toBeNull();
    expect(Number.isFinite(p.lastActiveAt)).toBe(true);
  });

  it('caps the notes and drops unknown extra fields', () => {
    const p = parseProgress({ ...json(), notes: 'x'.repeat(MAX_NOTES + 50), injected: '<script>' }, a.slug)!;
    expect(p.notes).toHaveLength(MAX_NOTES);
    expect('injected' in p).toBe(false);
  });

  it('round-trips a healthy save unchanged', () => {
    expect(parseProgress(json(), a.slug)).toEqual(good);
  });
});

describe('fitToAdventure keeps a save inside the story', () => {
  it('leaves a healthy save alone', () => {
    const p = solvedThrough(3);
    expect(fitToAdventure(p, chapterIds, itemIds)).toEqual(p);
    const done = reduce(solvedThrough(N), { type: 'decide', choiceId: 'return', chapterCount: N, now: 5000 });
    expect(fitToAdventure(done, chapterIds, itemIds)).toEqual(done);
  });

  it('pulls a chapter index past the end back to the first open chapter (it used to skip to the finale)', () => {
    const p = { ...solvedThrough(2), chapter: 7, stage: 'puzzle' as const };
    const fitted = fitToAdventure(p, chapterIds, itemIds);
    expect(fitted.chapter).toBe(2);
    expect(fitted.stage).toBe('travel');
  });

  it('never lets an unfinished game end without its chapters', () => {
    const p = { ...solvedThrough(1), chapter: N, decision: 'return', finishedAt: 9 };
    const fitted = fitToAdventure(p, chapterIds, itemIds);
    expect(fitted.chapter).toBe(1);
    expect(fitted.decision).toBeNull();
    expect(fitted.finishedAt).toBeNull();
  });

  it('drops chapters and items the story no longer has', () => {
    const p = { ...solvedThrough(2), solved: ['message', 'gone', 'witnesses'], inventory: ['brass-key', 'ghost-item'] };
    const fitted = fitToAdventure(p, chapterIds, itemIds);
    expect(fitted.solved).toEqual(['message', 'witnesses']);
    expect(fitted.inventory).toEqual(['brass-key']);
  });

  it('does not show "solved" for a chapter that is not', () => {
    const p = { ...solvedThrough(2), stage: 'solved' as const };
    expect(fitToAdventure(p, chapterIds, itemIds).stage).toBe('puzzle');
  });
});

// A minimal localStorage, so the device store can be tested in Node.
class MemoryStorage {
  private data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  key(i: number) {
    return [...this.data.keys()][i] ?? null;
  }
  getItem(k: string) {
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.data.set(k, String(v));
  }
  removeItem(k: string) {
    this.data.delete(k);
  }
}

describe('the device store', () => {
  let storage: MemoryStorage;
  beforeEach(() => {
    storage = new MemoryStorage();
    (globalThis as { window?: unknown }).window = { localStorage: storage };
  });
  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it('lists every readable save even when another record is corrupt', () => {
    storage.setItem('cityquest:progress:aaa-broken', '{not json');
    localProgressStore.save(solvedThrough(2));
    storage.setItem('cityquest:progress:zzz-also-broken', '"just a string"');
    const ring = { ...newProgress('neckar-ring', team, 1000) };
    localProgressStore.save(ring);
    expect(localProgressStore.all().map((p) => p.adventure).sort()).toEqual(['lost-manuscript', 'neckar-ring']);
    expect(localProgressStore.load('aaa-broken')).toBeNull();
  });

  it('remembers a restart until it is cleared, and sign-out forgets it with the saves', () => {
    pendingRestarts.add('lost-manuscript');
    pendingRestarts.add('neckar-ring');
    pendingRestarts.remove('neckar-ring');
    expect(pendingRestarts.list()).toEqual(['lost-manuscript']);
    localProgressStore.save(solvedThrough(1));
    storage.setItem('cityquest:3d', 'on');
    clearAllLocalProgress();
    expect(pendingRestarts.list()).toEqual([]);
    expect(localProgressStore.all()).toEqual([]);
    expect(storage.getItem('cityquest:3d')).toBe('on'); // other settings stay
  });

  it('keeps working when storage throws (private mode, full quota)', () => {
    (globalThis as { window?: unknown }).window = {
      localStorage: {
        get length(): number {
          throw new Error('denied');
        },
        getItem() {
          throw new Error('denied');
        },
        setItem() {
          throw new Error('quota');
        },
      },
    };
    expect(() => localProgressStore.save(solvedThrough(1))).not.toThrow();
    expect(localProgressStore.all()).toEqual([]);
    expect(pendingRestarts.list()).toEqual([]);
  });
});

describe('rate limiting', () => {
  it('allows the limit per window, then refuses with a retry time, then allows again', () => {
    const l = createLimiter(3, 60_000);
    expect([1, 2, 3].map(() => l.hit('a', 1000).ok)).toEqual([true, true, true]);
    expect(l.hit('a', 1000)).toEqual({ ok: false, retryAfter: 60 });
    expect(l.hit('b', 1000).ok).toBe(true); // other clients are unaffected
    expect(l.hit('a', 61_000).ok).toBe(true); // next window
  });

  it('stays bounded under a flood of distinct keys', () => {
    const l = createLimiter(1, 60_000);
    for (let i = 0; i < 25_000; i++) l.hit(`k${i}`, 1000);
    expect(l.hit('fresh', 1000).ok).toBe(true);
  });

  it('reads the client address from the proxy header, trimmed and bounded', () => {
    expect(clientKey(new Headers({ 'x-forwarded-for': ' 203.0.113.7 , 10.0.0.1' }))).toBe('203.0.113.7');
    expect(clientKey(new Headers({ 'x-real-ip': '198.51.100.2' }))).toBe('198.51.100.2');
    expect(clientKey(new Headers())).toBe('unknown');
    expect(clientKey(new Headers({ 'x-forwarded-for': 'x'.repeat(500) }))).toHaveLength(64);
  });
});
