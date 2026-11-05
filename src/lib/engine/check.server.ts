import 'server-only';
import type { Adventure } from '@/content/types';
import { getAdventure } from '@/content/adventures';
import { answerKeys } from '@/content/answers.server';
import { matchesAnswer } from './normalize';
import { gradeReport } from './report';

export type CheckResult = { ok: true; correct: boolean; confirmed?: string[] } | { ok: false; status: 400 | 404; error: string };

/** A validated guess: the adventure, which chapter it targets (and its index for order gating), the
 *  accepted answers for that chapter, and the player's typed answer. */
export type ResolvedGuess = {
  ok: true;
  adventure: Adventure;
  chapterId: string;
  chapterIndex: number;
  accepted: string[];
  answer: string;
  /** Not a chapter puzzle (a board question, a lead, winning back a stolen item): never recorded as a solve. */
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
  const { chapterId, answer, variant } = body as { chapterId?: unknown; answer?: unknown; variant?: unknown };
  if (typeof chapterId !== 'string' || typeof answer !== 'string' || answer.length > 200) {
    return { ok: false, status: 400, error: 'invalid body' };
  }
  // A replay's second truth: its own answers where they differ ("<key>@<variant>"), the original elsewhere.
  if (variant !== undefined && (typeof variant !== 'string' || !adventure.variants?.some((v) => v.id === variant))) {
    return { ok: false, status: 400, error: 'unknown variant' };
  }
  const accepted = (typeof variant === 'string' ? key[`${chapterId}@${variant}`]?.accepted : undefined) ?? key[chapterId]?.accepted;
  if (!accepted) return { ok: false, status: 404, error: 'unknown chapter' };
  // Extras are not chapters: board questions ("board:<id>") and leads ("lead:<id>") unlock after their
  // chapter, so for order gating they count as the chapter after it (every chapter up to and including
  // `after` must be solved); winning back what the pursuer took ("recover") can happen at any point.
  // The case report comes after the last chapter: every chapter must be solved first.
  if (chapterId === 'report') {
    if (!adventure.report) return { ok: false, status: 404, error: 'unknown chapter' };
    return { ok: true, adventure, chapterId, chapterIndex: adventure.chapters.length, accepted, answer, board: true };
  }
  if (chapterId === 'recover') {
    if (!adventure.pursuit?.caught) return { ok: false, status: 404, error: 'unknown chapter' };
    return { ok: true, adventure, chapterId, chapterIndex: 0, accepted, answer, board: true };
  }
  const extra = chapterId.startsWith('board:')
    ? adventure.board?.find((q) => `board:${q.id}` === chapterId)
    : chapterId.startsWith('lead:')
      ? adventure.leads?.find((l) => `lead:${l.id}` === chapterId)
      : undefined;
  const chapterIndex = extra
    ? adventure.chapters.findIndex((c) => c.id === extra.after) + 1
    : adventure.chapters.findIndex((c) => c.id === chapterId);
  if (chapterIndex < (extra ? 1 : 0)) return { ok: false, status: 404, error: 'unknown chapter' };
  return { ok: true, adventure, chapterId, chapterIndex, accepted, answer, board: !!extra };
}

/**
 * Validates one guess against the server-held answer key, with no authorisation. Used directly for
 * demo adventures (open, offline, no account) and by the unit tests; the route layers entitlement and
 * order gating on top for paid adventures (see entitlement.server.ts).
 */
export function checkAnswer(slug: string, body: unknown): CheckResult {
  const r = resolveGuess(slug, body);
  if (!r.ok) return r;
  return grade(r);
}

/** The verdict for a resolved guess: a case report is graded slot by slot, everything else matched. */
export function grade(r: ResolvedGuess): { ok: true; correct: boolean; confirmed?: string[] } {
  if (r.chapterId === 'report') return { ok: true, ...gradeReport(r.answer, r.accepted[0] ?? '') };
  return { ok: true, correct: matchesAnswer(r.answer, r.accepted) };
}
