import 'server-only';
import type { Adventure } from '@/content/types';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// Authorisation for answering a paid (non-demo) adventure. Demo adventures are open and never reach
// here — the route handles them statelessly so they keep working offline and signed-out.
//
// Two invariants, both read from the database, never from the client:
//   1. The player owns the adventure (a row in `entitlements`).
//   2. Every chapter before the one being answered is already solved (a row in `solves`), so a player
//      cannot skip ahead to a later puzzle. `solves` is written only by recordSolve below, after the
//      server has itself confirmed a correct answer — so progress.data is never trusted.
//
// Note: this stops skipping ahead, not unlimited guessing on the *current* chapter. Per-user guess
// throttling is deferred to Phase 3 (D9), when a purchasable adventure actually exists.

export type AuthzResult =
  | { ok: true; userId: string }
  | { ok: false; status: 401 | 403 | 503; error: string };

/** A paid adventure requires an account and a backend; a demo never does. */
export function requiresEntitlement(adventure: Adventure): boolean {
  return !adventure.isDemo;
}

export async function authorizePaidAnswer(
  slug: string,
  adventure: Adventure,
  chapterIndex: number,
): Promise<AuthzResult> {
  // No service role configured → we cannot verify ownership, so fail closed rather than let a paid
  // puzzle be answered unverified.
  if (!isAdminConfigured()) return { ok: false, status: 503, error: 'account backend unavailable' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, error: 'sign in required' };

  const admin = createAdminClient();

  const { data: entitlement, error: entErr } = await admin
    .from('entitlements')
    .select('adventure')
    .eq('user_id', user.id)
    .eq('adventure', slug)
    .maybeSingle();
  if (entErr) return { ok: false, status: 503, error: 'could not verify access' };
  if (!entitlement) return { ok: false, status: 403, error: 'adventure not owned' };

  // Order gating: every earlier chapter must be solved. One query, then a presence check.
  if (chapterIndex > 0) {
    const requiredIds = adventure.chapters.slice(0, chapterIndex).map((c) => c.id);
    const { data: solved, error: solErr } = await admin
      .from('solves')
      .select('chapter_id')
      .eq('user_id', user.id)
      .eq('adventure', slug)
      .in('chapter_id', requiredIds);
    if (solErr) return { ok: false, status: 503, error: 'could not verify progress' };
    const solvedIds = new Set((solved ?? []).map((r) => r.chapter_id));
    if (!requiredIds.every((id) => solvedIds.has(id))) {
      return { ok: false, status: 403, error: 'previous chapter not solved' };
    }
  }

  return { ok: true, userId: user.id };
}

/**
 * Record that this user solved this chapter. Called only after the server confirmed the answer.
 * Returns false if the write failed: the route must then NOT report success, or the client would
 * advance to a chapter the gating can never unlock (a silent soft-lock).
 */
export async function recordSolve(userId: string, slug: string, chapterId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin
    .from('solves')
    .upsert({ user_id: userId, adventure: slug, chapter_id: chapterId }, { onConflict: 'user_id,adventure,chapter_id' });
  if (error) {
    console.error('recordSolve failed', { slug, chapterId, error: error.message });
    return false;
  }
  return true;
}
