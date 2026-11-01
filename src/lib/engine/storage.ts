// Where progress is kept. Phase 1 saves it in this browser; Phase 2 adds a Supabase implementation of
// the same interface, so the game screen never needs to know which one it talks to.
import { parseProgress, type Progress } from './progress';

export interface ProgressStore {
  load(adventure: string): Progress | null;
  save(p: Progress): void;
  clear(adventure: string): void;
  all(): Progress[];
}

const PREFIX = 'cityquest:progress:';

export const localProgressStore: ProgressStore = {
  load(adventure) {
    try {
      const raw = window.localStorage.getItem(PREFIX + adventure);
      return raw ? parseProgress(JSON.parse(raw), adventure) : null;
    } catch {
      return null;
    }
  },
  save(p) {
    try {
      window.localStorage.setItem(PREFIX + p.adventure, JSON.stringify(p));
    } catch {
      // Private mode or a full quota: the game keeps working, it just will not resume after a reload.
    }
  },
  clear(adventure) {
    try {
      window.localStorage.removeItem(PREFIX + adventure);
    } catch {
      /* nothing saved to clear */
    }
  },
  all() {
    const out: Progress[] = [];
    for (const key of keysWith(PREFIX)) {
      // Each save on its own: one unreadable record must not hide every other adventure.
      try {
        const p = parseProgress(JSON.parse(window.localStorage.getItem(key) ?? 'null'), key.slice(PREFIX.length));
        if (p) out.push(p);
      } catch {
        /* skip this record */
      }
    }
    return out;
  },
};

function keysWith(prefix: string): string[] {
  const keys: string[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(prefix)) keys.push(key);
    }
  } catch {
    /* storage unavailable */
  }
  return keys;
}

// "Start over" must also delete the account's copy, or the next sync would bring the old game back. When
// that delete cannot reach the server (offline), the intent is remembered here and retried before the next
// sync merges anything.
const RESTART_PREFIX = 'cityquest:restart:';

export const pendingRestarts = {
  add(adventure: string) {
    try {
      window.localStorage.setItem(RESTART_PREFIX + adventure, '1');
    } catch {
      /* best effort */
    }
  },
  remove(adventure: string) {
    try {
      window.localStorage.removeItem(RESTART_PREFIX + adventure);
    } catch {
      /* best effort */
    }
  },
  list(): string[] {
    return keysWith(RESTART_PREFIX).map((k) => k.slice(RESTART_PREFIX.length));
  },
};

/**
 * Remove every saved game from this browser. Used on sign-out so one player's saves never carry into the
 * next account signed in on a shared device (they are safe in the account they were synced to). Pending
 * restarts go too: they belong to the account that is signing out, not the next one.
 */
export function clearAllLocalProgress(): void {
  try {
    for (const key of [...keysWith(PREFIX), ...keysWith(RESTART_PREFIX)]) window.localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
}
