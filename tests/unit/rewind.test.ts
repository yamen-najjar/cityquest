import { describe, expect, it } from 'vitest';
import { newProgress, reduce } from '@/lib/engine/progress';
import { rewindTo } from '@/lib/engine/rewind';

const ids = ['a', 'b', 'c', 'd'];
function played() {
  let p = newProgress('x', { name: 't', players: 2 }, 1000, 'classic', null);
  for (const id of ['a', 'b', 'c']) {
    p = reduce(p, { type: 'arrive' });
    p = reduce(p, { type: 'solve', chapterId: id });
    p = reduce(p, { type: 'next', chapterCount: 4 });
  }
  return { ...p, choices: { a: 'one', c: 'two' }, notes: 'my notes', inventory: ['key'] };
}

describe('rewindTo', () => {
  it('unsolves the chapter and everything after it, keeping notes and items', () => {
    const p = played();
    expect(p.chapter).toBe(3);
    const r = rewindTo(p, ids, 'b');
    expect(r.solved).toEqual(['a']);
    expect(r.chapter).toBe(1);
    expect(r.stage).toBe('travel');
    expect(r.choices).toEqual({ a: 'one' });
    expect(r.notes).toBe('my notes');
    expect(r.inventory).toEqual(['key']);
  });

  it('leaves a game that is already behind, and unknown chapters, alone', () => {
    const p = played();
    const behind = rewindTo(p, ids, 'a');
    expect(rewindTo(behind, ids, 'c')).toBe(behind);
    expect(rewindTo(p, ids, 'nope')).toBe(p);
  });
});
