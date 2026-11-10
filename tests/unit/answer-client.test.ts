// The shared answer helper: online-first, local grading offline, and the queue of offline solves.
import { beforeEach, describe, expect, it } from 'vitest';
import { checkAnswer, flushQueue, loadPack, loadQueue, refreshPack, type Env } from '@/lib/engine/answer-client';
import { buildAnswerPack } from '@/lib/engine/answer-pack.server';
import type { AnswerPack } from '@/lib/engine/answer-pack';
import { encodeReport } from '@/lib/engine/report';

type Call = { url: string; body?: { chapterId: string; answer: string; variant?: string } };

function makeEnv(opts: { online?: boolean; respond?: (call: Call) => Response | Promise<Response> } = {}) {
  const store = new Map<string, string>();
  const calls: Call[] = [];
  const logs: unknown[] = [];
  const env: Env & { online: boolean } = {
    online: opts.online ?? true,
    isOnline() {
      return this.online;
    },
    storage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => void store.set(k, v), removeItem: (k) => void store.delete(k) },
    fetch: (async (url: string, init?: RequestInit) => {
      const call: Call = { url, body: init?.body ? JSON.parse(String(init.body)) : undefined };
      calls.push(call);
      if (!opts.respond) throw new TypeError('Failed to fetch');
      return opts.respond(call);
    }) as typeof fetch,
    log: (...args) => void logs.push(args),
  };
  return { env, store, calls, logs };
}

const json = (body: unknown, status = 200) => Response.json(body, { status });
const storePack = (store: Map<string, string>, slug: string, pack: AnswerPack) => store.set(`cityquest:pack:${slug}`, JSON.stringify(pack));

let demoPack: AnswerPack;
let paidPack: AnswerPack;
beforeEach(async () => {
  demoPack = (await buildAnswerPack('lost-manuscript'))!;
  paidPack = { ...demoPack, paid: true };
});

describe('checkAnswer online', () => {
  it('posts to the check route and returns the server verdict untouched', async () => {
    const { env, calls } = makeEnv({ respond: () => json({ correct: true }) });
    expect(await checkAnswer('lost-manuscript', { chapterId: 'message', answer: 'tower', variant: null }, env)).toEqual({ status: 'ok', correct: true, offline: false });
    expect(calls).toEqual([{ url: '/api/game/lost-manuscript/check', body: { chapterId: 'message', answer: 'tower' } }]);
  });

  it('passes the report verdict on with its confirmed slots', async () => {
    const { env } = makeEnv({ respond: () => json({ correct: false, confirmed: ['a', 'b', 'c'] }) });
    expect(await checkAnswer('x', { chapterId: 'report', answer: 'y' }, env)).toEqual({ status: 'ok', correct: false, confirmed: ['a', 'b', 'c'], offline: false });
  });

  it('keeps the 429 and server-error behaviour, and does not grade locally for them', async () => {
    const { env, store } = makeEnv({ respond: () => json({ error: 'too many requests' }, 429) });
    storePack(store, 'lost-manuscript', demoPack);
    expect(await checkAnswer('lost-manuscript', { chapterId: 'message', answer: 'tower' }, env)).toEqual({ status: 'slow' });
    const broken = makeEnv({ respond: () => json({ error: 'x' }, 503) });
    storePack(broken.store, 'lost-manuscript', demoPack);
    expect(await checkAnswer('lost-manuscript', { chapterId: 'message', answer: 'tower' }, broken.env)).toEqual({ status: 'failed', noPack: false });
  });
});

describe('checkAnswer offline', () => {
  it('grades from the pack when the request fails, including when the browser says it is offline', async () => {
    for (const online of [true, false]) {
      const { env, store, calls } = makeEnv({ online });
      storePack(store, 'lost-manuscript', demoPack);
      expect(await checkAnswer('lost-manuscript', { chapterId: 'clockmaker', answer: '7347' }, env)).toEqual({ status: 'ok', correct: true, offline: true });
      expect(await checkAnswer('lost-manuscript', { chapterId: 'clockmaker', answer: '1111' }, env)).toEqual({ status: 'ok', correct: false, offline: true });
      // Offline by flag: no request at all. By failure: one attempt per answer.
      expect(calls.length).toBe(online ? 2 : 0);
    }
  });

  it('answers the report like the server, with the variant fallback', async () => {
    const { env, store } = makeEnv({ online: false });
    storePack(store, 'lost-manuscript', demoPack);
    const picks = { helper: 'anna', how: 'door', when: 'between', who: 'kehl', why: 'sell' };
    expect(await checkAnswer('lost-manuscript', { chapterId: 'report', answer: encodeReport(picks) }, env)).toMatchObject({ correct: false, confirmed: ['helper', 'how', 'when', 'who'] });
    expect(await checkAnswer('lost-manuscript', { chapterId: 'verdict', answer: 'anna+brass-key', variant: 'anna' }, env)).toMatchObject({ correct: true });
  });

  it('says so when no pack is stored, and when the pack does not know the chapter', async () => {
    const { env, store } = makeEnv({ online: false });
    expect(await checkAnswer('lost-manuscript', { chapterId: 'message', answer: 'tower' }, env)).toEqual({ status: 'failed', noPack: true });
    storePack(store, 'lost-manuscript', demoPack);
    expect(await checkAnswer('lost-manuscript', { chapterId: 'nope', answer: 'x' }, env)).toEqual({ status: 'failed', noPack: false });
  });

  it('survives storage that throws (private mode)', async () => {
    const { env } = makeEnv({ online: false });
    env.storage = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); }, removeItem: () => { throw new Error('denied'); } };
    expect(await checkAnswer('lost-manuscript', { chapterId: 'message', answer: 'tower' }, env)).toEqual({ status: 'failed', noPack: true });
    expect(loadQueue('lost-manuscript', env)).toEqual([]);
    expect(await refreshPack('lost-manuscript', { ...env, isOnline: () => true, fetch: (async () => json(demoPack)) as typeof fetch })).toBe('unavailable');
  });

  it('does not queue anything for a demo adventure', async () => {
    const { env, store } = makeEnv({ online: false });
    storePack(store, 'lost-manuscript', demoPack);
    await checkAnswer('lost-manuscript', { chapterId: 'clockmaker', answer: '7347' }, env);
    expect(loadQueue('lost-manuscript', env)).toEqual([]);
  });
});

describe('the queue of a paid adventure', () => {
  async function playOffline(env: Env, store: Map<string, string>) {
    storePack(store, 'lost-manuscript', paidPack);
    await checkAnswer('lost-manuscript', { chapterId: 'message', answer: 'WRONG' }, env); // wrong: not queued
    await checkAnswer('lost-manuscript', { chapterId: 'message', answer: 'tower' }, env);
    await checkAnswer('lost-manuscript', { chapterId: 'witnesses', answer: 'clara', variant: 'anna' }, env);
    await checkAnswer('lost-manuscript', { chapterId: 'board:liar', answer: 'x' }, env); // never queued
    await checkAnswer('lost-manuscript', { chapterId: 'lead:night', answer: 'katg' }, env); // never queued
    await checkAnswer('lost-manuscript', { chapterId: 'clockmaker', answer: '7347' }, env);
    await checkAnswer('lost-manuscript', { chapterId: 'clockmaker', answer: '7347' }, env); // a repeat: once
  }

  it('queues correct chapter answers in order, and only those', async () => {
    const { env, store } = makeEnv({ online: false });
    await playOffline(env, store);
    expect(loadQueue('lost-manuscript', env).map((e) => [e.chapterId, e.variant])).toEqual([['message', null], ['witnesses', 'anna'], ['clockmaker', null]]);
  });

  it('flushes in order through the check route and empties the queue', async () => {
    const offline = makeEnv({ online: false });
    await playOffline(offline.env, offline.store);
    const online = makeEnv({ respond: () => json({ correct: true }) });
    for (const [k, v] of offline.store) online.store.set(k, v);
    await flushQueue('lost-manuscript', online.env);
    expect(online.calls.map((c) => c.body?.chapterId)).toEqual(['message', 'witnesses', 'clockmaker']);
    expect(online.calls[1]!.body).toEqual({ chapterId: 'witnesses', answer: 'clara', variant: 'anna' });
    expect(loadQueue('lost-manuscript', online.env)).toEqual([]);
  });

  it('flushes before the next online check', async () => {
    const offline = makeEnv({ online: false });
    await playOffline(offline.env, offline.store);
    const online = makeEnv({ respond: () => json({ correct: true }) });
    for (const [k, v] of offline.store) online.store.set(k, v);
    await checkAnswer('lost-manuscript', { chapterId: 'signal', answer: '1847' }, online.env);
    expect(online.calls.map((c) => c.body?.chapterId)).toEqual(['message', 'witnesses', 'clockmaker', 'signal']);
  });

  it('drops a refused (4xx) answer, logs it, and carries on with the rest', async () => {
    const offline = makeEnv({ online: false });
    await playOffline(offline.env, offline.store);
    const online = makeEnv({ respond: (c) => (c.body?.chapterId === 'witnesses' ? json({ error: 'previous chapter not solved' }, 403) : json({ correct: true })) });
    for (const [k, v] of offline.store) online.store.set(k, v);
    await flushQueue('lost-manuscript', online.env);
    expect(online.calls.map((c) => c.body?.chapterId)).toEqual(['message', 'witnesses', 'clockmaker']);
    expect(loadQueue('lost-manuscript', online.env)).toEqual([]);
    expect(online.logs).toHaveLength(1);
  });

  it('keeps everything from the failing entry on (5xx, 429, network), without skipping ahead', async () => {
    for (const failure of [() => json({}, 503), () => json({}, 429), () => { throw new TypeError('offline'); }]) {
      const offline = makeEnv({ online: false });
      await playOffline(offline.env, offline.store);
      const online = makeEnv({ respond: (c) => (c.body?.chapterId === 'witnesses' ? failure() : json({ correct: true })) });
      for (const [k, v] of offline.store) online.store.set(k, v);
      await flushQueue('lost-manuscript', online.env);
      expect(online.calls.map((c) => c.body?.chapterId)).toEqual(['message', 'witnesses']);
      expect(loadQueue('lost-manuscript', online.env).map((e) => e.chapterId)).toEqual(['witnesses', 'clockmaker']);
    }
  });

  it('does nothing while still offline', async () => {
    const { env, store, calls } = makeEnv({ online: false });
    await playOffline(env, store);
    await flushQueue('lost-manuscript', env);
    expect(calls).toEqual([]);
    expect(loadQueue('lost-manuscript', env)).toHaveLength(3);
  });
});

describe('refreshPack', () => {
  it('stores a pack, keeps one with the same version, replaces a changed one', async () => {
    const { env, store } = makeEnv({ respond: () => json(demoPack) });
    expect(await refreshPack('lost-manuscript', env)).toBe('stored');
    expect(loadPack('lost-manuscript', env)?.version).toBe(demoPack.version);
    expect(await refreshPack('lost-manuscript', env)).toBe('kept');
    const changed = makeEnv({ respond: () => json({ ...demoPack, version: 'newer' }) });
    for (const [k, v] of store) changed.store.set(k, v);
    expect(await refreshPack('lost-manuscript', changed.env)).toBe('stored');
    expect(loadPack('lost-manuscript', changed.env)?.version).toBe('newer');
  });

  it('forgets the pack when access is denied, and ignores failures and junk', async () => {
    const denied = makeEnv({ respond: () => json({ error: 'adventure not owned' }, 403) });
    storePack(denied.store, 'lost-manuscript', paidPack);
    expect(await refreshPack('lost-manuscript', denied.env)).toBe('denied');
    expect(loadPack('lost-manuscript', denied.env)).toBeNull();

    const down = makeEnv({ respond: () => json({}, 503) });
    storePack(down.store, 'lost-manuscript', paidPack);
    expect(await refreshPack('lost-manuscript', down.env)).toBe('unavailable');
    expect(loadPack('lost-manuscript', down.env)).not.toBeNull();

    expect(await refreshPack('lost-manuscript', makeEnv({ respond: () => json({ nonsense: true }) }).env)).toBe('unavailable');
    expect(await refreshPack('lost-manuscript', makeEnv({ online: false }).env)).toBe('unavailable');
    expect(await refreshPack('lost-manuscript', makeEnv().env)).toBe('unavailable'); // fetch throws
  });
});
