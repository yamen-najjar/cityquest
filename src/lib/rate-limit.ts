// A small fixed-window rate limiter kept in server memory: free, no extra service, and enough to stop a
// script from hammering the answer check or the newsletter form. Its limit: each server instance counts
// on its own, so on a host that runs many instances the effective limit is a multiple of these numbers.
// A shared store (a table, or Redis) is the step up if that ever matters; until then this costs nothing.

type Window = { start: number; count: number };

export interface Limiter {
  /** Counts one request for `key`. ok: false means over the limit; retryAfter is in whole seconds. */
  hit(key: string, now?: number): { ok: true } | { ok: false; retryAfter: number };
}

/** Keys stop being tracked at this many, so a flood of distinct keys cannot grow memory without bound. */
const MAX_KEYS = 10_000;

export function createLimiter(limit: number, windowMs: number): Limiter {
  const windows = new Map<string, Window>();
  return {
    hit(key, now = Date.now()) {
      let w = windows.get(key);
      if (!w || now - w.start >= windowMs) {
        if (!w && windows.size >= MAX_KEYS) {
          for (const [k, old] of windows) if (now - old.start >= windowMs) windows.delete(k);
          // Still full of live windows: drop the oldest entries rather than refuse everyone.
          if (windows.size >= MAX_KEYS) for (const k of [...windows.keys()].slice(0, MAX_KEYS / 10)) windows.delete(k);
        }
        w = { start: now, count: 0 };
        windows.set(key, w);
      }
      w.count += 1;
      if (w.count > limit) return { ok: false, retryAfter: Math.max(1, Math.ceil((w.start + windowMs - now) / 1000)) };
      return { ok: true };
    },
  };
}

/**
 * The client address for rate limiting. Behind a proxy (any real host) it is the first entry of
 * x-forwarded-for; the header can be forged on a direct connection, which only lets a client pick its own
 * bucket — it never grants anything. Never logged.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return (forwarded || headers.get('x-real-ip') || 'unknown').slice(0, 64);
}
