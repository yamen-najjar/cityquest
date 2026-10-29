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
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (!key?.startsWith(PREFIX)) continue;
        const slug = key.slice(PREFIX.length);
        const p = parseProgress(JSON.parse(window.localStorage.getItem(key) ?? 'null'), slug);
        if (p) out.push(p);
      }
    } catch {
      /* storage unavailable */
    }
    return out;
  },
};
