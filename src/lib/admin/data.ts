import 'server-only';
import { adventures } from '@/content/adventures';
import { createAdminClient } from '@/lib/supabase/admin';

// All admin data access goes through the service role here, in one place, so pages and server actions
// never build their own privileged queries. Every function assumes the caller already passed
// requireAdmin().

export type Player = {
  id: string;
  email: string;
  locale: string;
  createdAt: string;
  lastSignInAt: string | null;
  solved: number;
  ownedCount: number;
};

export type OverviewStats = {
  players: number;
  entitlements: number;
  solves: number;
  signIns7d: number;
};

/** Fetch every auth user (small user base; one page of up to 1000). */
async function allUsers() {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  return data.users;
}

export async function overviewStats(): Promise<OverviewStats> {
  const admin = createAdminClient();
  const users = await allUsers();
  const [{ count: entitlements }, { count: solves }] = await Promise.all([
    admin.from('entitlements').select('*', { count: 'exact', head: true }),
    admin.from('solves').select('*', { count: 'exact', head: true }),
  ]);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const signIns7d = users.filter((u) => u.last_sign_in_at && Date.parse(u.last_sign_in_at) >= weekAgo).length;
  return { players: users.length, entitlements: entitlements ?? 0, solves: solves ?? 0, signIns7d };
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

/** Static adventures, overlaid with their DB `adventure_state` (status) and owner counts. */
export async function listAdventuresAdmin(): Promise<AdventureAdmin[]> {
  const admin = createAdminClient();
  const [{ data: states }, { data: ents }] = await Promise.all([
    admin.from('adventure_state').select('slug, status'),
    admin.from('entitlements').select('adventure'),
  ]);
  const statusOf = new Map((states ?? []).map((s) => [s.slug, s.status as 'draft' | 'published']));
  const ownersOf = new Map<string, number>();
  for (const e of ents ?? []) ownersOf.set(e.adventure, (ownersOf.get(e.adventure) ?? 0) + 1);

  return adventures.map((a) => ({
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
  const users = await allUsers();
  const emailOf = new Map(users.map((u) => [u.id, u.email ?? '—']));
  const { data, error } = await admin.from('entitlements').select('user_id, adventure, source, granted_at').order('granted_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((e) => ({
    userId: e.user_id,
    email: emailOf.get(e.user_id) ?? '(deleted account)',
    adventure: e.adventure,
    source: e.source,
    grantedAt: e.granted_at,
  }));
}

export type GrantResult = { ok: boolean; message: string };

/** Grant one adventure to the account with this email. The player must already have an account. */
export async function grantEntitlement(email: string, adventure: string): Promise<GrantResult> {
  const clean = email.trim().toLowerCase();
  if (!clean) return { ok: false, message: 'Enter the player’s email.' };
  const admin = createAdminClient();
  const users = await allUsers();
  const user = users.find((u) => (u.email ?? '').toLowerCase() === clean);
  if (!user) return { ok: false, message: `No account for ${clean}. The player signs in once (magic link) first.` };

  const { error } = await admin
    .from('entitlements')
    .upsert({ user_id: user.id, adventure, source: 'grant' }, { onConflict: 'user_id,adventure' });
  if (error) return { ok: false, message: `Could not grant access: ${error.message}` };
  return { ok: true, message: `Granted ${adventure} to ${clean}.` };
}

export async function revokeEntitlement(userId: string, adventure: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from('entitlements').delete().eq('user_id', userId).eq('adventure', adventure);
  if (error) throw error;
}

export async function listPlayers(): Promise<Player[]> {
  const admin = createAdminClient();
  const users = await allUsers();
  const [{ data: profiles }, { data: solves }, { data: ents }] = await Promise.all([
    admin.from('profiles').select('id, locale'),
    admin.from('solves').select('user_id'),
    admin.from('entitlements').select('user_id, adventure'),
  ]);
  const localeOf = new Map((profiles ?? []).map((p) => [p.id, p.locale]));
  const solvedOf = new Map<string, number>();
  for (const s of solves ?? []) solvedOf.set(s.user_id, (solvedOf.get(s.user_id) ?? 0) + 1);
  const ownedOf = new Map<string, number>();
  for (const e of ents ?? []) ownedOf.set(e.user_id, (ownedOf.get(e.user_id) ?? 0) + 1);

  return users
    .map((u) => ({
      id: u.id,
      email: u.email ?? '—',
      locale: localeOf.get(u.id) ?? 'de',
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at ?? null,
      solved: solvedOf.get(u.id) ?? 0,
      ownedCount: ownedOf.get(u.id) ?? 0,
    }))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}
