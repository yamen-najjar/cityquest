// Takes a saved game back to the start of one chapter, when the server turns out not to know a solve
// the device made offline (see answer-client.ts). Pure, so the game screen and the answer helper share it.
import type { Progress } from './progress';

/**
 * The game as it was on arriving at `chapterId`: that chapter and everything after it is unsolved again,
 * and what depended on them (choices, the ending) is cleared. Items and notes are kept; the player does not
 * lose what they typed or collected, only the claim to have solved the chapter.
 */
export function rewindTo(p: Progress, chapterIds: readonly string[], chapterId: string): Progress {
  const index = chapterIds.indexOf(chapterId);
  if (index < 0) return p;
  const before = new Set(chapterIds.slice(0, index));
  const stillSolved = p.solved.filter((id) => before.has(id));
  if (stillSolved.length === p.solved.length && p.chapter <= index && !p.finishedAt) return p;
  const choices = Object.fromEntries(Object.entries(p.choices).filter(([id]) => before.has(id)));
  return {
    ...p,
    solved: stillSolved,
    chapter: Math.min(p.chapter, index),
    stage: 'travel',
    choices,
    decision: null,
    finishedAt: null,
    reportDone: null,
  };
}
