import 'server-only';
import type { Adventure } from '@/content/types';
import { getAdventure } from '@/content/adventures';
import { answerKeys } from '@/content/answers.server';
import { matchesAnswer } from './normalize';

export type CheckResult = { ok: true; correct: boolean } | { ok: false; status: 400 | 404; error: string };

/** A validated guess: the adventure, which chapter it targets (and its index for order gating), the
 *  accepted answers for that chapter, and the player's typed answer. */
export type ResolvedGuess = {
  ok: true;
  adventure: Adventure;
  chapterId: string;
  chapterIndex: number;
  accepted: string[];
  answer: string;
  /** An evidence-board question rather than a chapter puzzle: optional, so never recorded as a solve. */
  board: boolean;
};
export type ResolveError = { ok: false; status: 400 | 404; error: string };

/**
 * Validates the request shape and resolves it against the server-held content and answer key, without
 * checking correctness, entitlement or order. Kept separate so the route can authorise a paid
 * adventure (ownership + previous chapter solved) before the answer is ever compared.
 */
export function resolveGuess(slug: string, body: unknown): ResolvedGuess | ResolveError {
  const adventure = getAdventure(slug);
  const key = answerKeys[slug];
  if (!adventure || !key) return { ok: false, status: 404, error: 'unknown adventure' };
  if (!body || typeof body !== 'object') return { ok: false, status: 400, error: 'invalid body' };
  const { chapterId, answer } = body as { chapterId?: unknown; answer?: unknown };
  if (typeof chapterId !== 'string' || typeof answer !== 'string' || answer.length > 200) {
    return { ok: false, status: 400, error: 'invalid body' };
  }
  const accepted = key[chapterId]?.accepted;
  // Board questions ("board:<id>") unlock after their chapter, so for order gating they count as the
  // chapter after it: every chapter up to and including `after` must be solved.
  const question = chapterId.startsWith('board:') ? adventure.board?.find((q) => `board:${q.id}` === chapterId) : undefined;
  const chapterIndex = question
    ? adventure.chapters.findIndex((c) => c.id === question.after) + 1
    : adventure.chapters.findIndex((c) => c.id === chapterId);
  if (chapterIndex < (question ? 1 : 0) || chapterIndex === -1 || !accepted) return { ok: false, status: 404, error: 'unknown chapter' };
  return { ok: true, adventure, chapterId, chapterIndex, accepted, answer, board: !!question };
}

/**
 * Validates one guess against the server-held answer key, with no authorisation. Used directly for
 * demo adventures (open, offline, no account) and by the unit tests; the route layers entitlement and
 * order gating on top for paid adventures (see entitlement.server.ts).
 */
export function checkAnswer(slug: string, body: unknown): CheckResult {
  const r = resolveGuess(slug, body);
  if (!r.ok) return r;
  return { ok: true, correct: matchesAnswer(r.answer, r.accepted) };
}
