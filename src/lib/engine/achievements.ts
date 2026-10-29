import type { Adventure, PuzzleType } from '@/content/types';
import type { Progress } from './progress';
import { isFinished, totalHints } from './progress';

export type AchievementId = 'first-clue' | 'codebreaker' | 'clear-thinker' | 'mystery-solved' | 'no-hints' | 'heidelberg-explorer';

export const ACHIEVEMENTS: AchievementId[] = [
  'first-clue',
  'codebreaker',
  'clear-thinker',
  'mystery-solved',
  'no-hints',
  'heidelberg-explorer',
];

/** What the rules need to know about an adventure; small enough to pass to the dashboard. */
export interface AchievementContext {
  city: string;
  chapters: { id: string; type: PuzzleType }[];
}

export function contextOf(a: Adventure): AchievementContext {
  return { city: a.city, chapters: a.chapters.map((c) => ({ id: c.id, type: c.puzzle.type })) };
}

const CODE_TYPES: PuzzleType[] = ['cipher', 'number-code', 'image'];

/**
 * Achievements are computed from saved progress, never stored on their own, so they cannot drift from
 * what the player actually did.
 */
export function earned(p: Progress, ctx: AchievementContext): AchievementId[] {
  const solvedOfType = (types: PuzzleType[]) => ctx.chapters.filter((c) => types.includes(c.type) && p.solved.includes(c.id));
  const out: AchievementId[] = [];
  if (p.solved.length >= 1) out.push('first-clue');
  if (solvedOfType(CODE_TYPES).length) out.push('codebreaker');
  if (solvedOfType(['logic']).some((c) => !(p.wrongAttempts[c.id] ?? 0))) out.push('clear-thinker');
  if (isFinished(p)) {
    out.push('mystery-solved');
    if (totalHints(p) === 0) out.push('no-hints');
    if (ctx.city === 'heidelberg') out.push('heidelberg-explorer');
  }
  return out;
}
