// Background sync between the local save (the instant, offline source of truth) and the account's
// copy in Supabase (the durable, cross-device mirror). See docs/PHASE2.md, decisions D2–D4.
//
// The game never waits on the network: it reads and writes localStorage synchronously as before.
// This module mirrors those writes up when signed in, and on sign-in reconciles the two sides with the
// pure merge rule (keep the furthest save per adventure). The database also enforces "furthest wins"
// (migration 20261031094501), so even a mistimed push can never regress account progress; the client
// rules below avoid needless writes and local data loss on top of that guarantee.
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { Json } from '@/lib/supabase/database.types';
import { reconcile } from './merge';
import { parseProgress, type Progress } from './progress';
import { clearAllLocalProgress, localProgressStore } from './storage';

export const SYNCED_EVENT = 'cityquest:synced';

let client: ReturnType<typeof createClient> | null = null;
function sb() {
  return (client ??= createClient());
}

function emitSynced() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(SYNCED_EVENT));
}

function sameProgress(a: Progress | undefined, b: Progress | undefined): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** The signed-in user id, read from the cached session (no network call). Null when signed out. */
async function currentUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await sb().auth.getSession();
  return data.session?.user?.id ?? null;
}

type Pull = { rows: Progress[]; adventures: Set<string> };

/** Every account save for the signed-in user, or null if the request failed (so callers can abort). */
async function remotePull(): Promise<Pull | null> {
  const { data, error } = await sb().from('progress').select('adventure, data');
  if (error || !data) return null;
  const rows: Progress[] = [];
  const adventures = new Set<string>();
  for (const row of data) {
    adventures.add(row.adventure);
    const p = parseProgress(row.data, row.adventure);
    if (p) rows.push(p);
  }
  return { rows, adventures };
}

async function remoteUpsert(userId: string, p: Progress): Promise<void> {
  await sb()
    .from('progress')
    .upsert({ user_id: userId, adventure: p.adventure, data: p as unknown as NonNullable<Json> }, { onConflict: 'user_id,adventure' });
}

// Pushes wait for the first reconcile so a stale local save never races ahead of the pulled account
// state. Resolves after the first reconcile attempt (success or failure); the DB invariant guards the
// rest. A shared promise also dedupes concurrent reconciles (SIGNED_IN re-fires on every tab focus).
let reconcileInFlight: Promise<void> | null = null;
let firstReconcileResolve: (() => void) | null = null;
const firstReconcile = new Promise<void>((resolve) => {
  firstReconcileResolve = resolve;
});

/**
 * Pull the account's saves, merge with this browser's, write back only where the account was further,
 * and push up only what differs. No-op when signed out. Safe to call repeatedly (deduped).
 */
export function reconcileNow(): Promise<void> {
  if (reconcileInFlight) return reconcileInFlight;
  reconcileInFlight = runReconcile().finally(() => {
    reconcileInFlight = null;
    firstReconcileResolve?.();
    firstReconcileResolve = null;
  });
  return reconcileInFlight;
}

async function runReconcile(): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;

  const pull = await remotePull();
  if (!pull) return; // transient error: do not treat as "remote is empty" and overwrite the account

  const remoteByAdventure = new Map(pull.rows.map((p) => [p.adventure, p]));
  const localByAdventure = new Map(localProgressStore.all().map((p) => [p.adventure, p])); // re-read AFTER the pull
  const merged = reconcile([...localByAdventure.values()], pull.rows);

  for (const p of merged) {
    const local = localByAdventure.get(p.adventure);
    const remote = remoteByAdventure.get(p.adventure);
    // Write to local only when the merge changed it (the account was further) — never clobber newer local.
    if (!sameProgress(local, p)) localProgressStore.save(p);
    // Push only a real change, and never over a remote row that exists but failed to parse.
    if (!sameProgress(remote, p) && !(pull.adventures.has(p.adventure) && !remote)) await remoteUpsert(userId, p);
  }
  emitSynced();
}

const pushTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Mirror one local save up to the account, debounced per adventure. Waits for the first reconcile so it
 * cannot push a stale save ahead of the pulled state. A no-op when signed out.
 */
export function pushLocalDebounced(p: Progress, delayMs = 1500): void {
  if (!isSupabaseConfigured()) return;
  const existing = pushTimers.get(p.adventure);
  if (existing) clearTimeout(existing);
  pushTimers.set(
    p.adventure,
    setTimeout(async () => {
      pushTimers.delete(p.adventure);
      await firstReconcile;
      const userId = await currentUserId();
      if (userId) await remoteUpsert(userId, p);
    }, delayMs),
  );
}

/** Drop any pending push for an adventure (used when the player starts that adventure over). */
export function cancelPush(adventure: string): void {
  const existing = pushTimers.get(adventure);
  if (existing) {
    clearTimeout(existing);
    pushTimers.delete(adventure);
  }
}

/** Delete one adventure's account save (used by "start over"), so the next reconcile cannot resurrect it. */
export async function remoteDelete(adventure: string): Promise<void> {
  cancelPush(adventure);
  const userId = await currentUserId();
  if (!userId) return;
  await sb().from('progress').delete().eq('user_id', userId).eq('adventure', adventure);
}

/** On sign-out, clear this device's saves so they never merge into the next account on a shared browser. */
export async function signOutAndClear(): Promise<void> {
  if (isSupabaseConfigured()) await sb().auth.signOut({ scope: 'local' });
  clearAllLocalProgress();
}
