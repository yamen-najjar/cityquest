// After the game is taken back (the server refused an offline solve), the next account sync must keep
// the rewound save. The merge keeps the further save, and the account's still holds the refused solves,
// so without help the game would jump ahead again and be refused again.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAdventure } from '@/content/adventures';
import { newProgress, reduce, type Progress } from '@/lib/engine/progress';

const adventure = getAdventure('lost-manuscript')!;
const ids = adventure.chapters.map((c) => c.id);

/** An in-memory account: one table, the way sync.ts uses it. */
const remote = new Map<string, unknown>();
/** While set, the account's answer to a pull is held back (a reconcile that is under way). */
let pullGate: Promise<void> | null = null;
vi.mock('@/lib/supabase/config', () => ({ isSupabaseConfigured: () => true }));
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getSession: async () => ({ data: { session: { user: { id: 'u1' } } } }) },
    from: () => ({
      select: async () => {
        const snapshot = [...remote].map(([adventure, data]) => ({ adventure, data }));
        if (pullGate) await pullGate;
        return { data: snapshot, error: null };
      },
      upsert: async (row: { adventure: string; data: unknown }) => {
        remote.set(row.adventure, row.data);
        return { error: null };
      },
      delete: () => ({ eq: () => ({ eq: async () => ((remote.clear(), { error: null })) }) }),
    }),
  }),
}));

const local = new Map<string, string>();
beforeEach(() => {
  pullGate = null;
  remote.clear();
  local.clear();
  (globalThis as { window?: unknown }).window = {
    dispatchEvent: () => true,
    localStorage: {
      get length() {
        return local.size;
      },
      key: (i: number) => [...local.keys()][i] ?? null,
      getItem: (k: string) => local.get(k) ?? null,
      setItem: (k: string, v: string) => void local.set(k, v),
      removeItem: (k: string) => void local.delete(k),
    },
  };
});

function playedThrough(n: number): Progress {
  let p = newProgress('lost-manuscript', { name: 'Owls', players: 2 }, 1000);
  for (const id of ids.slice(0, n)) {
    p = reduce(reduce(p, { type: 'arrive' }), { type: 'solve', chapterId: id });
    p = reduce(p, { type: 'next', chapterCount: ids.length });
  }
  return { ...p, lastActiveAt: 5000 };
}

describe('a rewound save and the account', () => {
  it('wins the next reconcile, on the device and in the account', async () => {
    const { reconcileNow } = await import('@/lib/engine/sync');
    const { localProgressStore } = await import('@/lib/engine/storage');
    const { rewindLocalSave } = await import('@/lib/engine/answer-client');

    const ahead = playedThrough(3);
    localProgressStore.save(ahead);
    remote.set('lost-manuscript', ahead); // the account was pushed while the device was ahead

    await rewindLocalSave('lost-manuscript', ids[1]!);
    await reconcileNow();
    await reconcileNow(); // and again, as a reload or the "online" event would

    expect(localProgressStore.load('lost-manuscript')!.solved).toEqual([ids[0]]);
    expect((remote.get('lost-manuscript') as Progress).solved).toEqual([ids[0]]);
  });

  it('would lose without it: the plain merge brings the refused solves back', async () => {
    const { reconcileNow } = await import('@/lib/engine/sync');
    const { localProgressStore } = await import('@/lib/engine/storage');
    const { rewindTo } = await import('@/lib/engine/rewind');
    const ahead = playedThrough(3);
    localProgressStore.save(rewindTo(ahead, ids, ids[1]!));
    remote.set('lost-manuscript', ahead);
    await reconcileNow();
    expect(localProgressStore.load('lost-manuscript')!.solved).toHaveLength(3);
  });

  it('survives a reconcile that is already running when the game is taken back', async () => {
    const { reconcileNow } = await import('@/lib/engine/sync');
    const { localProgressStore } = await import('@/lib/engine/storage');
    const { rewindLocalSave } = await import('@/lib/engine/answer-client');

    const ahead = playedThrough(3);
    localProgressStore.save(ahead);
    remote.set('lost-manuscript', ahead);

    let release: () => void = () => {};
    pullGate = new Promise<void>((r) => (release = r));
    const running = reconcileNow(); // e.g. the "online" event: it has pulled the account's ahead copy
    await new Promise((r) => setTimeout(r, 0));
    const rewinding = rewindLocalSave('lost-manuscript', ids[1]!);
    await new Promise((r) => setTimeout(r, 0));
    pullGate = null;
    release();
    await Promise.all([running, rewinding]);
    await reconcileNow();

    expect(localProgressStore.load('lost-manuscript')!.solved).toEqual([ids[0]]);
    expect((remote.get('lost-manuscript') as Progress).solved).toEqual([ids[0]]);
  });

  it('does not wait for ever on a reconcile that stalls on bad reception', async () => {
    const { reconcileNow } = await import('@/lib/engine/sync');
    const { localProgressStore } = await import('@/lib/engine/storage');
    const { rewindLocalSave } = await import('@/lib/engine/answer-client');

    localProgressStore.save(playedThrough(3));
    let release: () => void = () => {};
    pullGate = new Promise<void>((r) => (release = r));
    const stalled = reconcileNow();

    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    try {
      let done = false;
      const rewinding = rewindLocalSave('lost-manuscript', ids[1]!).then(() => (done = true));
      for (let i = 0; i < 5; i++) await new Promise((r) => setImmediate(r)); // let its imports resolve
      await vi.advanceTimersByTimeAsync(4999);
      expect(done).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      await rewinding;
      expect(localProgressStore.load('lost-manuscript')!.solved).toEqual([ids[0]]);
    } finally {
      vi.useRealTimers();
      pullGate = null;
      release();
      await stalled;
    }
  });
});
