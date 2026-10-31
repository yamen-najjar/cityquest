import { beforeEach, describe, expect, it, vi } from 'vitest';

// grantEntitlement decides who gets paid access, so its branches (bad email, no account, success,
// write failure) are worth guarding. The service role client is mocked; the full flow is also verified
// live against the stack. It looks the account up by email in `profiles` and never rewrites an existing
// entitlement's provenance (ignoreDuplicates).

let profileRow: { id: string } | null = null;
let upsertError: { message: string } | null = null;
const upserts: { row: unknown; opts: unknown }[] = [];

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: (table: string) => {
      if (table === 'profiles') {
        return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: profileRow, error: null }) }) }) };
      }
      return {
        upsert: async (row: unknown, opts: unknown) => {
          upserts.push({ row, opts });
          return { error: upsertError };
        },
      };
    },
  }),
}));

const { grantEntitlement } = await import('@/lib/admin/data');

beforeEach(() => {
  profileRow = { id: 'u1' };
  upsertError = null;
  upserts.length = 0;
});

describe('grantEntitlement', () => {
  it('rejects an empty email without looking anything up', async () => {
    expect(await grantEntitlement('   ', 'neckar-ring')).toMatchObject({ ok: false });
    expect(upserts).toHaveLength(0);
  });

  it('rejects when no account matches, without writing', async () => {
    profileRow = null;
    expect(await grantEntitlement('nobody@example.com', 'neckar-ring')).toMatchObject({ ok: false });
    expect(upserts).toHaveLength(0);
  });

  it('upserts for a known account and never overwrites existing provenance', async () => {
    const r = await grantEntitlement('Owner@Example.com', 'neckar-ring');
    expect(r.ok).toBe(true);
    expect(upserts).toHaveLength(1);
    expect(upserts[0]!.row).toEqual({ user_id: 'u1', adventure: 'neckar-ring', source: 'grant' });
    expect(upserts[0]!.opts).toMatchObject({ onConflict: 'user_id,adventure', ignoreDuplicates: true });
  });

  it('reports a write failure instead of claiming success', async () => {
    upsertError = { message: 'boom' };
    expect(await grantEntitlement('owner@example.com', 'neckar-ring')).toMatchObject({ ok: false });
  });
});
