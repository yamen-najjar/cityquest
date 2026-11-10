// The one way the game checks an answer. Online-first: the server stays the authority, exactly as
// before. When the request cannot get through (no reception), the answer is graded on this device
// against the answer pack stored when the adventure was last opened online (see answer-pack.ts).
//
// For a paid adventure a correct offline answer is also queued, and sent through the normal check route
// when reception returns, so the server's `solves` table catches up. Board questions, leads, the case
// report and winning back a stolen item are never recorded server-side, so they are never queued.
import { gradeWithPack, type AnswerPack, type Verdict } from './answer-pack';

export type CheckBody = { chapterId: string; answer: string; variant?: string | null };

export type CheckOutcome =
  | { status: 'ok'; correct: boolean; confirmed?: string[]; offline: boolean }
  /** The server said 429: too many tries. */
  | { status: 'slow' }
  /** Not checked. `noPack`: offline and this adventure was never opened online on this device. */
  | { status: 'failed'; noPack: boolean };

type Queued = { chapterId: string; answer: string; variant: string | null };

/** Everything that touches the browser, so the tests can swap it. */
export interface Env {
  fetch: typeof fetch;
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null;
  isOnline: () => boolean;
  log: (message: string, detail: unknown) => void;
}

const browserEnv: Env = {
  fetch: (...args) => fetch(...args),
  get storage() {
    try {
      return window.localStorage;
    } catch {
      return null; // some privacy modes throw on access
    }
  },
  isOnline: () => typeof navigator === 'undefined' || navigator.onLine !== false,
  log: (message, detail) => console.warn(message, detail),
};

const PACK_PREFIX = 'cityquest:pack:';
const QUEUE_PREFIX = 'cityquest:queue:';

/** Bad reception often hangs instead of failing: after this long the request counts as a failure. */
const REQUEST_TIMEOUT_MS = 10_000;

const OFFLINE_ONLY_KEYS = /^(board:|lead:|report$|recover$)/;
/** Only chapter puzzles are recorded as solves server-side. */
export const isQueueable = (chapterId: string) => !OFFLINE_ONLY_KEYS.test(chapterId);

// ---- storage (every access guarded: private mode and full quotas must never crash the game) ----

function read<T>(env: Env, key: string): T | null {
  try {
    const raw = env.storage?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(env: Env, key: string, value: unknown): boolean {
  try {
    if (!env.storage) return false;
    env.storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function remove(env: Env, key: string) {
  try {
    env.storage?.removeItem(key);
  } catch {
    /* nothing to remove */
  }
}

const isPack = (v: unknown): v is AnswerPack => {
  const p = v as AnswerPack | null;
  return !!p && typeof p.version === 'string' && typeof p.salt === 'string' && !!p.keys && typeof p.keys === 'object';
};

export function loadPack(slug: string, env: Env = browserEnv): AnswerPack | null {
  const pack = read<unknown>(env, PACK_PREFIX + slug);
  return isPack(pack) ? pack : null;
}

export type PackRefresh = 'stored' | 'kept' | 'unavailable' | 'denied';

/**
 * Fetches the adventure's pack while online and stores it. A pack already stored with the same version
 * is kept. 'denied' (not signed in / not owned) also forgets any stored pack, so a pack never outlives
 * the right to it. Never throws.
 */
export async function refreshPack(slug: string, env: Env = browserEnv): Promise<PackRefresh> {
  if (!env.isOnline()) return 'unavailable';
  try {
    const res = await env.fetch(`/api/game/${slug}/pack`, { cache: 'no-store', signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (res.status === 401 || res.status === 403) {
      remove(env, PACK_PREFIX + slug);
      return 'denied';
    }
    if (!res.ok) return 'unavailable';
    const pack: unknown = await res.json();
    if (!isPack(pack)) return 'unavailable';
    if (loadPack(slug, env)?.version === pack.version) return 'kept';
    return write(env, PACK_PREFIX + slug, pack) ? 'stored' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

// ---- the queue of offline solves of a paid adventure ----

export const loadQueue = (slug: string, env: Env = browserEnv): Queued[] => {
  const q = read<Queued[]>(env, QUEUE_PREFIX + slug);
  return Array.isArray(q) ? q.filter((e) => e && typeof e.chapterId === 'string' && typeof e.answer === 'string') : [];
};

function saveQueue(env: Env, slug: string, queue: Queued[]) {
  if (queue.length) write(env, QUEUE_PREFIX + slug, queue);
  else remove(env, QUEUE_PREFIX + slug);
}

function enqueue(env: Env, slug: string, entry: Queued) {
  const queue = loadQueue(slug, env);
  if (!queue.some((e) => e.chapterId === entry.chapterId && e.variant === entry.variant)) saveQueue(env, slug, [...queue, entry]);
}

const flushing = new Map<string, Promise<void>>();

/**
 * Sends the queued solves of one adventure, oldest first, through the ordinary check route. The order
 * matters: the server only accepts a chapter once the ones before it are recorded.
 *  - 2xx: sent, removed.
 *  - 4xx (the server refused it: not owned, wrong, out of order): dropped and logged. The player keeps
 *    the progress they made on this device; only the server's record misses it. 429 is the exception: it
 *    only means "later", so it stays queued.
 *  - 5xx or no network: kept, and the rest waits behind it (so the order is never broken).
 */
export function flushQueue(slug: string, env: Env = browserEnv): Promise<void> {
  const running = flushing.get(slug);
  if (running) return running;
  const job = (async () => {
    if (!env.isOnline()) return;
    for (let queue = loadQueue(slug, env); queue.length; queue = loadQueue(slug, env)) {
      const [first] = queue;
      let status: number;
      try {
        const res = await env.fetch(`/api/game/${slug}/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chapterId: first!.chapterId, answer: first!.answer, variant: first!.variant ?? undefined }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        status = res.status;
      } catch {
        return; // no network: keep everything
      }
      if (status >= 500 || status === 429) return;
      if (status >= 400) env.log('queued answer refused by the server, dropped', { slug, chapterId: first!.chapterId, status });
      saveQueue(env, slug, queue.slice(1));
    }
  })().finally(() => flushing.delete(slug));
  flushing.set(slug, job);
  return job;
}

// ---- checking an answer ----

async function gradeLocally(env: Env, slug: string, body: CheckBody): Promise<CheckOutcome> {
  const pack = loadPack(slug, env);
  if (!pack) return { status: 'failed', noPack: true };
  let verdict: Verdict | null;
  try {
    verdict = await gradeWithPack(pack, body.chapterId, body.answer, body.variant);
  } catch {
    return { status: 'failed', noPack: false }; // Web Crypto unavailable (an insecure origin)
  }
  if (!verdict) return { status: 'failed', noPack: false };
  if (verdict.correct && pack.paid && isQueueable(body.chapterId)) {
    enqueue(env, slug, { chapterId: body.chapterId, answer: body.answer, variant: body.variant ?? null });
  }
  return { status: 'ok', correct: verdict.correct, ...(verdict.confirmed ? { confirmed: verdict.confirmed } : {}), offline: true };
}

export async function checkAnswer(slug: string, body: CheckBody, env: Env = browserEnv): Promise<CheckOutcome> {
  if (env.isOnline()) {
    try {
      // Whatever was solved offline reaches the server before the next online check of this adventure.
      await flushQueue(slug, env);
      const res = await env.fetch(`/api/game/${slug}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: body.chapterId, answer: body.answer, variant: body.variant ?? undefined }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (res.status === 429) return { status: 'slow' };
      if (!res.ok) return { status: 'failed', noPack: false };
      const { correct, confirmed } = (await res.json()) as Verdict;
      return { status: 'ok', correct, ...(confirmed ? { confirmed } : {}), offline: false };
    } catch {
      // The request never got an answer: treat it like having no reception.
    }
  }
  return gradeLocally(env, slug, body);
}
