// The pack endpoint: open for demos, owner-only for paid adventures, fail-closed, never cached.
import { beforeEach, describe, expect, it, vi } from 'vitest';

let ownerResult: { ok: true; userId: string } | { ok: false; status: 401 | 403 | 503; error: string };
let ownerThrows = false;
let paidAdventure = false;

vi.mock('@/lib/engine/entitlement.server', () => ({
  requiresEntitlement: () => paidAdventure,
  authorizeOwner: async () => {
    if (ownerThrows) throw new Error('db down');
    return ownerResult;
  },
}));

const { GET } = await import('@/app/api/game/[slug]/pack/route');

let ip = 0;
const call = (slug = 'lost-manuscript', address = `198.51.100.${++ip}`) =>
  GET(new Request(`http://localhost/api/game/${slug}/pack`, { headers: { 'x-forwarded-for': address } }), { params: Promise.resolve({ slug }) });

beforeEach(() => {
  paidAdventure = false;
  ownerThrows = false;
  ownerResult = { ok: true, userId: 'u1' };
});

describe('GET /api/game/[slug]/pack', () => {
  it('serves a demo pack to anyone, uncached', async () => {
    const res = await call();
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    const pack = await res.json();
    expect(pack.version).toMatch(/^[0-9a-f]{16}$/);
    expect(typeof pack.salt).toBe('string');
    expect(Object.keys(pack.keys)).toContain('clockmaker');
    expect(JSON.stringify(pack)).not.toContain('7347');
  });

  it('404s on an unknown adventure', async () => {
    expect((await call('nope')).status).toBe(404);
  });

  it('refuses a paid pack to a signed-out visitor and to a non-owner', async () => {
    paidAdventure = true;
    ownerResult = { ok: false, status: 401, error: 'sign in required' };
    expect((await call()).status).toBe(401);
    ownerResult = { ok: false, status: 403, error: 'adventure not owned' };
    const res = await call();
    expect(res.status).toBe(403);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(JSON.stringify(await res.json())).not.toContain('keys');
  });

  it('serves a paid pack to the owner', async () => {
    paidAdventure = true;
    const res = await call();
    expect(res.status).toBe(200);
    expect(Object.keys((await res.json()).keys)).toContain('clockmaker');
  });

  it('fails closed when the backend cannot verify', async () => {
    paidAdventure = true;
    ownerResult = { ok: false, status: 503, error: 'account backend unavailable' };
    expect((await call()).status).toBe(503);
    ownerThrows = true;
    expect((await call()).status).toBe(503);
  });

  it('rate limits a client collecting packs', async () => {
    const bot = '203.0.113.9';
    const statuses: number[] = [];
    for (let i = 0; i < 122; i++) statuses.push((await call('lost-manuscript', bot)).status);
    expect(statuses.slice(0, 120).every((s) => s === 200)).toBe(true);
    expect(statuses.slice(120)).toEqual([429, 429]);
  });
});
