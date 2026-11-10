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
vi.mock('@/lib/supabase/config', () => ({ isSupabaseConfigured: () => true }));
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getSession: async () => ({ data: { session: { user: { id: 'u1' } } } }) },
    from: () => ({
      select: async () => ({ data: [...remote].map(([adventure, data]) => ({ adventure, data })), error: null }),
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
});
