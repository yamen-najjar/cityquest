// Background sync between the local save (the instant, offline source of truth) and the account's
// copy in Supabase (the durable, cross-device mirror). See docs/PHASE2.md, decisions D2–D4.
//
// The game never waits on the network: it reads and writes localStorage synchronously as before.
// This module mirrors those writes up when signed in, and on sign-in reconciles the two sides with the
// pure merge rule (keep the furthest save per adventure), writing the result back to local and pushing
// it up so both ends converge. A `cityquest:synced` window event lets the screens re-read local.
import { createClient } from '@/lib/supabase/client';
import type { Json } from '@/lib/supabase/database.types';
import { reconcile } from './merge';
import { parseProgress, type Progress } from './progress';
import { localProgressStore } from './storage';

export const SYNCED_EVENT = 'cityquest:synced';

let client: ReturnType<typeof createClient> | null = null;
function sb() {
  return (client ??= createClient());
}

function emitSynced() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(SYNCED_EVENT));
}

async function currentUserId(): Promise<string | null> {
  const { data } = await sb().auth.getUser();
  return data.user?.id ?? null;
}

/** Every account save for the signed-in user. RLS limits the rows to their own. */
async function remotePull(): Promise<Progress[]> {
  const { data, error } = await sb().from('progress').select('adventure, data');
  if (error || !data) return [];
  const out: Progress[] = [];
  for (const row of data) {
    const p = parseProgress(row.data, row.adventure);
    if (p) out.push(p);
  }
  return out;
}

async function remoteUpsert(userId: string, p: Progress): Promise<void> {
  await sb()
    .from('progress')
    .upsert({ user_id: userId, adventure: p.adventure, data: p as unknown as NonNullable<Json> }, { onConflict: 'user_id,adventure' });
}

/**
 * Pull the account's saves, merge with what is in this browser, write the merged result back to local
 * and push it up. Safe to call repeatedly. No-op when signed out.
 */
export async function reconcileNow(): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  const merged = reconcile(localProgressStore.all(), await remotePull());
  for (const p of merged) localProgressStore.save(p);
  await Promise.all(merged.map((p) => remoteUpsert(userId, p)));
  emitSynced();
}

const pushTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Mirror one local save up to the account, debounced per adventure so a burst of steps becomes one
 * write. A no-op when signed out; the next sign-in reconcile carries the local save up instead.
 */
export function pushLocalDebounced(p: Progress, delayMs = 1500): void {
  const existing = pushTimers.get(p.adventure);
  if (existing) clearTimeout(existing);
  pushTimers.set(
    p.adventure,
    setTimeout(async () => {
      pushTimers.delete(p.adventure);
      const userId = await currentUserId();
      if (userId) await remoteUpsert(userId, p);
    }, delayMs),
  );
}
