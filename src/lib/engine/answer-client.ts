// The one way the game checks an answer. Online-first: the server stays the authority, exactly as
// before. When the request cannot get through (no reception), the answer is graded on this device
// against the answer pack stored when the adventure was last opened online (see answer-pack.ts).
//
// For a paid adventure a correct offline answer is also queued, and sent through the normal check route
// when reception returns, so the server's `solves` table catches up. Board questions, leads, the case
// report and winning back a stolen item are never recorded server-side, so they are never queued.
import { MAX_ANSWER_LENGTH, gradeWithPack, type AnswerPack, type Verdict } from './answer-pack';
import { rewindTo } from './rewind';

export type CheckBody = { chapterId: string; answer: string; variant?: string | null };

export type CheckOutcome =
  | { status: 'ok'; correct: boolean; confirmed?: string[]; offline: boolean }
  /** The server said 429: too many tries. */
  | { status: 'slow' }
  /**
   * Not checked. `nopack`: offline and this adventure was never opened online on this device (or its pack
   * belongs to someone else). `diverged`: the server does not know an earlier solve of this device; the
   * game has been taken back to match it. `network`: anything else.
   */
  | { status: 'failed'; reason: 'network' | 'nopack' | 'diverged' };

type Queued = { chapterId: string; answer: string; variant: string | null; userId: string };

/** A pack as stored: a paid one remembers whose it is, so it never grades for someone else. */
type StoredPack = AnswerPack & { userId?: string };

/** Sent (on window) when the game was taken back to a chapter; the game screen follows. */
export const DIVERGED_EVENT = 'cityquest:diverged';
export type DivergedDetail = { slug: string; chapterId: string };

/** Everything that touches the browser, so the tests can swap it. */
export interface Env {
  fetch: typeof fetch;
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null;
  isOnline: () => boolean;
  log: (message: string, detail: unknown) => void;
  /** The signed-in user's id (from the cached session, no network), or null. */
  getUserId: () => Promise<string | null>;
  /** The server rejected a solve this device made: take the saved game back to `chapterId`. */
  onDiverged: (slug: string, chapterId: string) => void;
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
  async getUserId() {
    try {
      const [{ isSupabaseConfigured }, { createClient }] = await Promise.all([import('@/lib/supabase/config'), import('@/lib/supabase/client')]);
      if (!isSupabaseConfigured()) return null;
      const { data } = await createClient().auth.getSession();
      return data.session?.user?.id ?? null;
    } catch {
      return null;
    }
  },
  onDiverged(slug, chapterId) {
    void (async () => {
      try {
        const [{ getAdventure }, { localProgressStore }] = await Promise.all([import('@/content/adventures'), import('./storage')]);
        const adventure = getAdventure(slug);
        const saved = localProgressStore.load(slug);
        if (adventure && saved) localProgressStore.save(rewindTo(saved, adventure.chapters.map((c) => c.id), chapterId));
      } catch {
        /* the game screen rewinds its own copy too */
      }
      window.dispatchEvent(new CustomEvent<DivergedDetail>(DIVERGED_EVENT, { detail: { slug, chapterId } }));
    })();
  },
};

const PACK_PREFIX = 'cityquest:pack:';
const QUEUE_PREFIX = 'cityquest:queue:';

/** How long the real check waits for earlier offline solves to reach the server before it goes ahead. */
const FLUSH_BUDGET_MS = 2500;

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

function loadStoredPack(slug: string, env: Env): StoredPack | null {
  const pack = read<unknown>(env, PACK_PREFIX + slug);
  return isPack(pack) ? (pack as StoredPack) : null;
}

/** The stored pack, whoever's it is. Only for checking what is stored; grading uses loadUsablePack. */
export const loadPack = (slug: string, env: Env = browserEnv): AnswerPack | null => loadStoredPack(slug, env);

/** The stored pack if this signed-in user may grade with it: a demo pack, or a paid pack stored for them. */
export async function loadUsablePack(slug: string, env: Env = browserEnv): Promise<AnswerPack | null> {
  const pack = loadStoredPack(slug, env);
  if (!pack) return null;
  if (!pack.paid) return pack;
  const userId = await env.getUserId();
  return userId && pack.userId === userId ? pack : null;
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
    const userId = pack.paid ? await env.getUserId() : null;
    if (pack.paid && !userId) return 'unavailable';
    const stored = loadStoredPack(slug, env);
    if (stored?.version === pack.version && stored.userId === (userId ?? undefined)) return 'kept';
    return write(env, PACK_PREFIX + slug, userId ? { ...pack, userId } : pack) ? 'stored' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

/** Sign-out: forget every pack and queued answer on this device, and stop a flush that is under way. */
let epoch = 0;
export function clearOfflineData(env: Env = browserEnv): void {
  epoch++;
  try {
    const storage = env.storage as Storage | null;
    if (!storage) return;
    const doomed: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && (key.startsWith(PACK_PREFIX) || key.startsWith(QUEUE_PREFIX))) doomed.push(key);
    }
    for (const key of doomed) storage.removeItem(key);
  } catch {
    /* storage unavailable */
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

type Refusal = { chapterId: string };

/**
 * Sends the queued solves of one adventure, oldest first, through the ordinary check route. The order
 * matters: the server only accepts a chapter once the ones before it are recorded.
 *  - 2xx and correct: sent, removed.
 *  - Refused (a 4xx other than 401/429, or a 200 that says "wrong", e.g. after the answer key changed): the
 *    server does not have this solve, and will not have the ones after it either. They are dropped, logged,
 *    and the saved game is taken back to the chapter the server lacks (env.onDiverged), so device and
 *    server agree again instead of every later check failing.
 *  - 401, 429, 5xx or no network: kept, and the rest waits behind it, so the order is never broken.
 * Only the signed-in user's own entries are sent; anyone else's are discarded.
 */
export function flushQueue(slug: string, env: Env = browserEnv): Promise<void> {
  const running = flushing.get(slug);
  if (running) return running;
  const job = (async () => {
    if (!env.isOnline() || !loadQueue(slug, env).length) return;
    const userId = await env.getUserId();
    if (!userId) return;
    const started = epoch;
    // A pack from before an answer-key change would keep grading wrongly: refresh it first.
    await refreshPack(slug, env);
    const mine = loadQueue(slug, env).filter((e) => e.userId === userId);
    if (mine.length !== loadQueue(slug, env).length) saveQueue(env, slug, mine);
    for (let queue = mine; queue.length && epoch === started; queue = loadQueue(slug, env)) {
      const first = queue[0]!;
      let status: number;
      let body: { correct?: boolean; firstUnsolved?: string } = {};
      try {
        const res = await env.fetch(`/api/game/${slug}/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chapterId: first.chapterId, answer: first.answer, variant: first.variant ?? undefined }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        status = res.status;
        body = await res.json().catch(() => ({}));
      } catch {
        return; // no network: keep everything
      }
      if (epoch !== started) return; // signed out meanwhile: the queue is already gone
      if (status >= 500 || status === 429 || status === 401) return;
      const accepted = status < 300 && body.correct === true;
      if (accepted) {
        saveQueue(env, slug, queue.slice(1));
        continue;
      }
      const refusal: Refusal = { chapterId: body.firstUnsolved ?? first.chapterId };
      env.log('queued answer refused by the server, taking the game back', { slug, answered: first.chapterId, status, backTo: refusal.chapterId });
      saveQueue(env, slug, []);
      env.onDiverged(slug, refusal.chapterId);
      return;
    }
  })().finally(() => flushing.delete(slug));
  flushing.set(slug, job);
  return job;
}

// ---- checking an answer ----

async function gradeLocally(env: Env, slug: string, body: CheckBody): Promise<CheckOutcome> {
  if (body.answer.length > MAX_ANSWER_LENGTH) return { status: 'failed', reason: 'network' };
  const pack = await loadUsablePack(slug, env);
  if (!pack) return { status: 'failed', reason: 'nopack' };
  let verdict: Verdict | null;
  try {
    verdict = await gradeWithPack(pack, body.chapterId, body.answer, body.variant);
  } catch {
    return { status: 'failed', reason: 'network' }; // Web Crypto unavailable (an insecure origin)
  }
  if (!verdict) return { status: 'failed', reason: 'network' };
  if (verdict.correct && pack.paid && isQueueable(body.chapterId)) {
    const userId = await env.getUserId();
    if (userId) enqueue(env, slug, { chapterId: body.chapterId, answer: body.answer, variant: body.variant ?? null, userId });
  }
  return { status: 'ok', correct: verdict.correct, ...(verdict.confirmed ? { confirmed: verdict.confirmed } : {}), offline: true };
}

export async function checkAnswer(slug: string, body: CheckBody, env: Env = browserEnv): Promise<CheckOutcome> {
  if (env.isOnline()) {
    try {
      // Whatever was solved offline reaches the server before this check, but never holds it up for long.
      await Promise.race([flushQueue(slug, env), new Promise((resolve) => setTimeout(resolve, FLUSH_BUDGET_MS))]);
      const res = await env.fetch(`/api/game/${slug}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: body.chapterId, answer: body.answer, variant: body.variant ?? undefined }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (res.status === 429) return { status: 'slow' };
      if (res.status === 403) {
        // The server lacks an earlier solve (offline play that never reached it): go back to that chapter.
        const refused = (await res.json().catch(() => ({}))) as { error?: string; firstUnsolved?: string };
        if (refused.error === 'previous chapter not solved' && refused.firstUnsolved) {
          saveQueue(env, slug, []);
          env.onDiverged(slug, refused.firstUnsolved);
          return { status: 'failed', reason: 'diverged' };
        }
        return { status: 'failed', reason: 'network' };
      }
      if (!res.ok) return { status: 'failed', reason: 'network' };
      const { correct, confirmed } = (await res.json()) as Verdict;
      return { status: 'ok', correct, ...(confirmed ? { confirmed } : {}), offline: false };
    } catch {
      // The request never got an answer: treat it like having no reception.
    }
  }
  return gradeLocally(env, slug, body);
}
