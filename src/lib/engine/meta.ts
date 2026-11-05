// What lives beyond a single case: the lantern signs that link the stories, and the letter a week later.
import { isFinished, isLost, type Progress } from './progress';

/** The letter arrives this long after the case is solved. */
export const LETTER_DELAY_MS = 7 * 24 * 60 * 60 * 1000;

/** When the letter arrives (ms), or null: only a solved case, never a lost one, gets a letter. */
export function letterAt(p: Progress): number | null {
  return isFinished(p) && !isLost(p) && p.finishedAt ? p.finishedAt + LETTER_DELAY_MS : null;
}

/** Whole days until the letter arrives, at least 1 while it is still on its way. */
export function daysUntil(at: number, now: number): number {
  return Math.max(1, Math.ceil((at - now) / (24 * 60 * 60 * 1000)));
}

/** A story's lantern sign is won by solving the case with every one of its secrets found. */
export function tokenEarned(p: Progress, secretIds: string[]): boolean {
  return isFinished(p) && !isLost(p) && secretIds.every((id) => p.secrets.includes(id));
}
