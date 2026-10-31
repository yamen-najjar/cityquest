// Merging two saves of the same adventure (decision D3 in docs/PHASE2.md).
//
// When a player signs in, a guest game in this browser can meet an account game from another device.
// We never silently drop either: we keep the one that is *further*, so no progress is lost. "Further"
// is decided by, in order:
//   1. a finished game beats an unfinished one,
//   2. more solved chapters,
//   3. the save that was active more recently.
// Everything here is pure, so it is unit-tested directly and runs the same on the client or the server.
import { isFinished, type Progress } from './progress';

/** True if `a` is at least as far along as `b` (so ties keep `a`). */
export function isAtLeastAsFar(a: Progress, b: Progress): boolean {
  const aDone = isFinished(a);
  const bDone = isFinished(b);
  if (aDone !== bDone) return aDone;
  if (a.solved.length !== b.solved.length) return a.solved.length > b.solved.length;
  return a.lastActiveAt >= b.lastActiveAt;
}

/** The further of two saves for the same adventure. */
export function furtherProgress(a: Progress, b: Progress): Progress {
  if (a.adventure !== b.adventure) {
    throw new Error(`cannot merge progress for different adventures: ${a.adventure} vs ${b.adventure}`);
  }
  return isAtLeastAsFar(a, b) ? a : b;
}

/**
 * Reconcile local and remote saves into one list, keeping the further save of each adventure. Used both
 * ways: the result is written back to local and pushed to the server, so both ends converge.
 */
export function reconcile(local: Progress[], remote: Progress[]): Progress[] {
  const byAdventure = new Map<string, Progress>();
  for (const p of [...remote, ...local]) {
    const existing = byAdventure.get(p.adventure);
    byAdventure.set(p.adventure, existing ? furtherProgress(p, existing) : p);
  }
  return [...byAdventure.values()];
}
