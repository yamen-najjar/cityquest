import { beforeEach, describe, expect, it, vi } from 'vitest';

// grantEntitlement decides who gets paid access, so its branches (bad email, no account, case-folding,
// write failure) are worth guarding. The service role client is mocked; the full flow is also verified
// live against the stack.

let users: { id: string; email: string | null }[] = [];
let upsertError: { message: string } | null = null;
const upserts: { row: unknown; opts: unknown }[] = [];

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    auth: { admin: { listUsers: async () => ({ data: { users }, error: null }) } },
    from: () => ({
      upsert: async (row: unknown, opts: unknown) => {
        upserts.push({ row, opts });
        return { error: upsertError };
      },
    }),
  }),
}));

const { grantEntitlement } = await import('@/lib/admin/data');

beforeEach(() => {
  users = [{ id: 'u1', email: 'Owner@Example.com' }];
  upsertError = null;
  upserts.length = 0;
});

describe('grantEntitlement', () => {
  it('rejects an empty email without writing', async () => {
    expect(await grantEntitlement('   ', 'neckar-ring')).toMatchObject({ ok: false });
    expect(upserts).toHaveLength(0);
  });

  it('rejects when no account matches, without writing', async () => {
    expect(await grantEntitlement('nobody@example.com', 'neckar-ring')).toMatchObject({ ok: false });
    expect(upserts).toHaveLength(0);
  });

  it('matches the email case-insensitively and upserts the entitlement', async () => {
    const r = await grantEntitlement('owner@example.com', 'neckar-ring');
    expect(r.ok).toBe(true);
    expect(upserts).toHaveLength(1);
    expect(upserts[0]!.row).toEqual({ user_id: 'u1', adventure: 'neckar-ring', source: 'grant' });
    expect(upserts[0]!.opts).toMatchObject({ onConflict: 'user_id,adventure' });
  });

  it('reports a write failure instead of claiming success', async () => {
    upsertError = { message: 'boom' };
    expect(await grantEntitlement('owner@example.com', 'neckar-ring')).toMatchObject({ ok: false });
  });
});
