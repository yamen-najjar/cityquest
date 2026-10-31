import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Adventure } from '@/content/types';

// The gating logic in entitlement.server.ts is the valuable part: who may answer, and in what order.
// It talks to Supabase, so here the Supabase modules are mocked and the decision branches are asserted
// directly — no live database needed. The RLS invariants it relies on are verified against the live
// stack by hand (see docs/PHASE2.md); a full paid-flow e2e is deferred to Phase 3 (D9), when a real
// purchasable adventure exists to run it against.

let adminConfigured = true;
let currentUser: { id: string } | null;
let entitlementRow: { adventure: string } | null;
let solvedRows: { chapter_id: string }[];
let lastSolvesQueryIds: string[] | null;
let solvesUpsertError: { message: string } | null;
const upserts: { table: string; row: unknown; options: unknown }[] = [];

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: currentUser } }) },
  }),
}));

vi.mock('@/lib/supabase/admin', () => ({
  isAdminConfigured: () => adminConfigured,
  createAdminClient: () => ({
    from: (table: string) => {
      if (table === 'entitlements') {
        return {
          select: () => ({
            eq: () => ({ eq: () => ({ maybeSingle: async () => ({ data: entitlementRow, error: null }) }) }),
          }),
        };
      }
      if (table === 'solves') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                in: async (_col: string, ids: string[]) => {
                  lastSolvesQueryIds = ids;
                  return { data: solvedRows, error: null };
                },
              }),
            }),
          }),
          upsert: async (row: unknown, options: unknown) => {
            upserts.push({ table, row, options });
            return { error: solvesUpsertError };
          },
        };
      }
      throw new Error(`unexpected table ${table}`);
    },
  }),
}));

// Imported after the mocks are registered.
const { authorizePaidAnswer, recordSolve, requiresEntitlement } = await import('@/lib/engine/entitlement.server');

const paid = { slug: 'paid-tour', isDemo: false, chapters: [{ id: 'c0' }, { id: 'c1' }, { id: 'c2' }] } as unknown as Adventure;

beforeEach(() => {
  adminConfigured = true;
  currentUser = { id: 'u1' };
  entitlementRow = { adventure: 'paid-tour' };
  solvedRows = [];
  lastSolvesQueryIds = null;
  solvesUpsertError = null;
  upserts.length = 0;
});

describe('requiresEntitlement', () => {
  it('is true for a paid adventure and false for a demo', () => {
    expect(requiresEntitlement(paid)).toBe(true);
    expect(requiresEntitlement({ isDemo: true } as Adventure)).toBe(false);
  });
});

describe('authorizePaidAnswer', () => {
  it('fails closed with 503 when no service role is configured', async () => {
    adminConfigured = false;
    expect(await authorizePaidAnswer('paid-tour', paid, 0)).toMatchObject({ ok: false, status: 503 });
  });

  it('refuses an anonymous caller with 401', async () => {
    currentUser = null;
    expect(await authorizePaidAnswer('paid-tour', paid, 0)).toMatchObject({ ok: false, status: 401 });
  });

  it('refuses a signed-in caller who does not own the adventure with 403', async () => {
    entitlementRow = null;
    expect(await authorizePaidAnswer('paid-tour', paid, 0)).toMatchObject({ ok: false, status: 403 });
  });

  it('allows the first chapter without querying solves', async () => {
    const r = await authorizePaidAnswer('paid-tour', paid, 0);
    expect(r).toEqual({ ok: true, userId: 'u1' });
    expect(lastSolvesQueryIds).toBeNull(); // no order check needed for chapter 0
  });

  it('allows a later chapter only when every earlier chapter is solved', async () => {
    solvedRows = [{ chapter_id: 'c0' }, { chapter_id: 'c1' }];
    const r = await authorizePaidAnswer('paid-tour', paid, 2);
    expect(r).toEqual({ ok: true, userId: 'u1' });
    expect(lastSolvesQueryIds).toEqual(['c0', 'c1']);
  });

  it('blocks skipping ahead when an earlier chapter is missing with 403', async () => {
    solvedRows = [{ chapter_id: 'c0' }]; // c1 not solved
    expect(await authorizePaidAnswer('paid-tour', paid, 2)).toMatchObject({ ok: false, status: 403 });
  });
});

describe('recordSolve', () => {
  it('upserts the solve keyed by (user, adventure, chapter) and reports success', async () => {
    expect(await recordSolve('u1', 'paid-tour', 'c1')).toBe(true);
    expect(upserts).toHaveLength(1);
    expect(upserts[0]!.row).toEqual({ user_id: 'u1', adventure: 'paid-tour', chapter_id: 'c1' });
    expect(upserts[0]!.options).toMatchObject({ onConflict: 'user_id,adventure,chapter_id' });
  });

  it('reports failure when the write errors, so the route can avoid a false "correct"', async () => {
    solvesUpsertError = { message: 'boom' };
    expect(await recordSolve('u1', 'paid-tour', 'c1')).toBe(false);
  });
});
