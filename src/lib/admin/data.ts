import 'server-only';
import { allAdventures } from '@/content/adventures';
import { createAdminClient } from '@/lib/supabase/admin';

// All admin data access goes through the service role here, in one place, so pages and server actions
// never build their own privileged queries. Every function assumes the caller already passed
// requireAdmin(). Reads use `profiles` (one row per user, email mirrored) rather than
// auth.admin.listUsers(), whose first-page limit made counts and email lookups wrong past 1000 users.

export type Player = {
  id: string;
  email: string;
  locale: string;
  createdAt: string;
  solved: number;
  ownedCount: number;
};

export type OverviewStats = {
  players: number;
  entitlements: number;
  solves: number;
  newThisWeek: number;
};

export async function overviewStats(): Promise<OverviewStats> {
  const admin = createAdminClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  // head + exact count returns the number in a header, so it is not capped by the row limit.
  const [players, entitlements, solves, recent] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('entitlements').select('*', { count: 'exact', head: true }),
    admin.from('solves').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
  ]);
  return {
    players: players.count ?? 0,
    entitlements: entitlements.count ?? 0,
    solves: solves.count ?? 0,
    newThisWeek: recent.count ?? 0,
  };
}

export async function listPlayers(): Promise<Player[]> {
  const admin = createAdminClient();
  const [{ data: profiles }, { data: solves }, { data: ents }] = await Promise.all([
    admin.from('profiles').select('id, email, locale, created_at').order('created_at', { ascending: false }),
    admin.from('solves').select('user_id'),
    admin.from('entitlements').select('user_id'),
  ]);
  const solvedOf = new Map<string, number>();
  for (const s of solves ?? []) solvedOf.set(s.user_id, (solvedOf.get(s.user_id) ?? 0) + 1);
  const ownedOf = new Map<string, number>();
  for (const e of ents ?? []) ownedOf.set(e.user_id, (ownedOf.get(e.user_id) ?? 0) + 1);

  return (profiles ?? []).map((p) => ({
    id: p.id,
    email: p.email ?? '—',
    locale: p.locale,
    createdAt: p.created_at,
    solved: solvedOf.get(p.id) ?? 0,
    ownedCount: ownedOf.get(p.id) ?? 0,
  }));
}

export type AdventureAdmin = {
  slug: string;
  title: string;
  tier: string;
  priceCents: number;
  chapters: number;
  isDemo: boolean;
  owners: number;
  status: 'draft' | 'published';
};

/** Every adventure (including content drafts), overlaid with DB `adventure_state` and owner counts. */
export async function listAdventuresAdmin(): Promise<AdventureAdmin[]> {
  const admin = createAdminClient();
  const [{ data: states }, { data: ents }] = await Promise.all([
    admin.from('adventure_state').select('slug, status'),
    admin.from('entitlements').select('adventure'),
  ]);
  const statusOf = new Map((states ?? []).map((s) => [s.slug, s.status as 'draft' | 'published']));
  const ownersOf = new Map<string, number>();
  for (const e of ents ?? []) ownersOf.set(e.adventure, (ownersOf.get(e.adventure) ?? 0) + 1);

  return allAdventures.map((a) => ({
    slug: a.slug,
    title: a.title.en,
    tier: a.tier,
    priceCents: a.priceCents,
    chapters: a.chapters.length,
    isDemo: a.isDemo,
    owners: ownersOf.get(a.slug) ?? 0,
    // The DB overlay wins; otherwise the status authored in the content file.
    status: statusOf.get(a.slug) ?? (a.status as 'draft' | 'published'),
  }));
}

/** Set an adventure's publish state (admin intent). Takes effect publicly at the next deploy/rebuild. */
export async function setAdventureStatus(slug: string, status: 'draft' | 'published'): Promise<void> {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('bad slug');
  const admin = createAdminClient();
  const { error } = await admin.from('adventure_state').upsert({ slug, status }, { onConflict: 'slug' });
  if (error) throw error;
}

export type EntitlementRow = { userId: string; email: string; adventure: string; source: string; grantedAt: string };

export async function listEntitlements(): Promise<EntitlementRow[]> {
  const admin = createAdminClient();
  const [{ data: ents, error }, { data: profiles }] = await Promise.all([
    admin.from('entitlements').select('user_id, adventure, source, granted_at').order('granted_at', { ascending: false }),
    admin.from('profiles').select('id, email'),
  ]);
  if (error) throw error;
  const emailOf = new Map((profiles ?? []).map((p) => [p.id, p.email ?? '—']));
  return (ents ?? []).map((e) => ({
    userId: e.user_id,
    email: emailOf.get(e.user_id) ?? '—',
    adventure: e.adventure,
    source: e.source,
    grantedAt: e.granted_at,
  }));
}

export type GrantResult = { ok: boolean; message: string; email?: string };

/** Grant one adventure to the account with this email. The player must already have an account. */
export async function grantEntitlement(email: string, adventure: string): Promise<GrantResult> {
  const clean = email.trim().toLowerCase();
  if (!clean) return { ok: false, message: 'Enter the player’s email.' };
  const admin = createAdminClient();
  // GoTrue stores emails lowercased, mirrored into profiles.email, so an exact match is reliable.
  const { data: profile, error: lookupErr } = await admin.from('profiles').select('id').eq('email', clean).maybeSingle();
  if (lookupErr) return { ok: false, message: 'Could not look up the account.', email: clean };
  if (!profile) return { ok: false, message: `No account for ${clean}. The player signs in once (magic link) first.`, email: clean };

  // ignoreDuplicates: never rewrite an existing row's source (e.g. a real 'purchase' from Phase 3).
  const { error } = await admin
    .from('entitlements')
    .upsert({ user_id: profile.id, adventure, source: 'grant' }, { onConflict: 'user_id,adventure', ignoreDuplicates: true });
  if (error) return { ok: false, message: `Could not grant access: ${error.message}`, email: clean };
  return { ok: true, message: `${clean} can now play this adventure.` };
}

export async function revokeEntitlement(userId: string, adventure: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from('entitlements').delete().eq('user_id', userId).eq('adventure', adventure);
  if (error) throw error;
}
