import { describe, expect, it } from 'vitest';
import { furtherProgress, isAtLeastAsFar, reconcile } from '@/lib/engine/merge';
import { newProgress, reduce, type Progress } from '@/lib/engine/progress';

const team = { name: 'Owls', players: 3 };

/** A save of `adventure` with `solved` chapters solved, last active at `lastActiveAt`. */
function save(adventure: string, solved: number, lastActiveAt: number): Progress {
  let p = newProgress(adventure, team, 1000);
  for (let i = 0; i < solved; i++) {
    p = reduce(p, { type: 'arrive' });
    p = reduce(p, { type: 'solve', chapterId: `c${i}` });
    p = reduce(p, { type: 'next', chapterCount: 99 });
  }
  return { ...p, lastActiveAt };
}

function finished(adventure: string, lastActiveAt: number): Progress {
  const p = save(adventure, 8, lastActiveAt);
  return { ...p, chapter: 8, decision: 'return', finishedAt: lastActiveAt };
}

describe('isAtLeastAsFar', () => {
  it('prefers a finished game over an unfinished one, even if the unfinished one was more recent', () => {
    const done = finished('x', 100);
    const ongoing = save('x', 7, 9999);
    expect(isAtLeastAsFar(done, ongoing)).toBe(true);
    expect(isAtLeastAsFar(ongoing, done)).toBe(false);
  });

  it('prefers more solved chapters when neither is finished', () => {
    expect(isAtLeastAsFar(save('x', 5, 100), save('x', 3, 9999))).toBe(true);
    expect(isAtLeastAsFar(save('x', 3, 9999), save('x', 5, 100))).toBe(false);
  });

  it('breaks a tie by the more recent activity, keeping the first on an exact tie', () => {
    expect(isAtLeastAsFar(save('x', 4, 500), save('x', 4, 400))).toBe(true);
    expect(isAtLeastAsFar(save('x', 4, 400), save('x', 4, 500))).toBe(false);
    expect(isAtLeastAsFar(save('x', 4, 400), save('x', 4, 400))).toBe(true);
  });
});

describe('furtherProgress', () => {
  it('returns the further save', () => {
    const ahead = save('x', 6, 100);
    const behind = save('x', 2, 9999);
    expect(furtherProgress(ahead, behind)).toBe(ahead);
    expect(furtherProgress(behind, ahead)).toBe(ahead);
  });

  it('throws when the two saves are for different adventures', () => {
    expect(() => furtherProgress(save('a', 1, 1), save('b', 1, 1))).toThrow();
  });
});

describe('reconcile', () => {
  it('keeps the further save of each adventure across local and remote', () => {
    const local = [save('a', 5, 100), save('b', 1, 100)];
    const remote = [save('a', 2, 9999), save('c', 3, 100)];
    const out = reconcile(local, remote);
    const byId = new Map(out.map((p) => [p.adventure, p]));
    expect([...byId.keys()].sort()).toEqual(['a', 'b', 'c']);
    expect(byId.get('a')!.solved.length).toBe(5); // local was further
    expect(byId.get('b')!.solved.length).toBe(1); // only local had it
    expect(byId.get('c')!.solved.length).toBe(3); // only remote had it
  });

  it('is order-independent for which side is further', () => {
    const a1 = save('a', 5, 100);
    const a2 = save('a', 8, 100);
    expect(reconcile([a1], [a2])[0]!.solved.length).toBe(8);
    expect(reconcile([a2], [a1])[0]!.solved.length).toBe(8);
  });
});
