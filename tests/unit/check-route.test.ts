// The answer-check endpoint: size limits, bad input, and the per-client rate limit.
import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/game/[slug]/check/route';

let ip = 0;
/** Each test gets its own client address, so the rate limit of one test never leaks into another. */
const freshIp = () => `192.0.2.${++ip}`;

function call(body: string, opts: { ip?: string; slug?: string; headers?: Record<string, string> } = {}) {
  const req = new Request('http://localhost/api/game/x/check', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': opts.ip ?? freshIp(), ...opts.headers },
    body,
  });
  return POST(req, { params: Promise.resolve({ slug: opts.slug ?? 'lost-manuscript' }) });
}

describe('POST /api/game/[slug]/check', () => {
  it('checks a demo answer', async () => {
    const res = await call(JSON.stringify({ chapterId: 'message', answer: 'tower' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ correct: true });
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('refuses oversized bodies, by header and by actual size', async () => {
    expect((await call('{}', { headers: { 'content-length': '999999' } })).status).toBe(413);
    expect((await call(JSON.stringify({ chapterId: 'message', answer: 'x', pad: 'y'.repeat(5000) }))).status).toBe(413);
  });

  it('refuses malformed input and unknown targets without leaking details', async () => {
    expect((await call('{oops')).status).toBe(400);
    expect((await call(JSON.stringify({ chapterId: 'message' }))).status).toBe(400);
    const unknown = await call(JSON.stringify({ chapterId: 'message', answer: 'x' }), { slug: 'nope' });
    expect(unknown.status).toBe(404);
    expect(JSON.stringify(await unknown.json())).not.toContain('accepted');
  });

  it('slows down a script guessing codes, but not other players', async () => {
    const bot = freshIp();
    const statuses: number[] = [];
    for (let code = 0; code < 45; code++) {
      const res = await call(JSON.stringify({ chapterId: 'clockmaker', answer: String(code).padStart(4, '0') }), { ip: bot });
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 40).every((s) => s === 200)).toBe(true);
    expect(statuses.slice(40).every((s) => s === 429)).toBe(true);
    const limited = await call(JSON.stringify({ chapterId: 'clockmaker', answer: '7347' }), { ip: bot });
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get('retry-after'))).toBeGreaterThan(0);
    // Another team is not affected.
    expect((await call(JSON.stringify({ chapterId: 'clockmaker', answer: '7347' }))).status).toBe(200);
  });
});
