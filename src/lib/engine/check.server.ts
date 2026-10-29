import 'server-only';
import { getAdventure } from '@/content/adventures';
import { answerKeys } from '@/content/answers.server';
import { matchesAnswer } from './normalize';

export type CheckResult = { ok: true; correct: boolean } | { ok: false; status: 400 | 404; error: string };

/**
 * Validates one guess against the server-held answer key. Kept apart from the route handler so the
 * tests call it directly. Phase 2 adds: the player's entitlement to this adventure, and that the
 * previous chapters are solved, both read from the database rather than trusted from the client.
 */
export function checkAnswer(slug: string, body: unknown): CheckResult {
  const adventure = getAdventure(slug);
  const key = answerKeys[slug];
  if (!adventure || !key) return { ok: false, status: 404, error: 'unknown adventure' };
  if (!body || typeof body !== 'object') return { ok: false, status: 400, error: 'invalid body' };
  const { chapterId, answer } = body as { chapterId?: unknown; answer?: unknown };
  if (typeof chapterId !== 'string' || typeof answer !== 'string' || answer.length > 200) {
    return { ok: false, status: 400, error: 'invalid body' };
  }
  const chapter = adventure.chapters.find((c) => c.id === chapterId);
  const accepted = key[chapterId]?.accepted;
  if (!chapter || !accepted) return { ok: false, status: 404, error: 'unknown chapter' };
  return { ok: true, correct: matchesAnswer(answer, accepted) };
}
