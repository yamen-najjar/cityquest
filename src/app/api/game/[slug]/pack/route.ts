import { NextResponse } from 'next/server';
import { getAdventure } from '@/content/adventures';
import { buildAnswerPack } from '@/lib/engine/answer-pack.server';
import { authorizeOwner, requiresEntitlement } from '@/lib/engine/entitlement.server';
import { clientKey, createLimiter } from '@/lib/rate-limit';

// The answer pack: salted hashes of an adventure's accepted answers, so a phone can grade answers
// without reception. Plain answers never leave the server (see answer-pack.server.ts, docs/SECURITY.md).
// Never cached: every response carries its own salt, and a paid pack must not outlive the purchase check.
const noStore = { 'Cache-Control': 'no-store' };

// A player fetches one pack per adventure per visit; the limit only stops a script from collecting
// packs (each with a different salt) in bulk.
const perClient = createLimiter(30, 60_000);

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const limited = perClient.hit(clientKey(req.headers));
  if (!limited.ok) {
    return NextResponse.json({ error: 'too many requests' }, { status: 429, headers: { ...noStore, 'Retry-After': String(limited.retryAfter) } });
  }

  const adventure = getAdventure(slug);
  if (!adventure) return NextResponse.json({ error: 'unknown adventure' }, { status: 404, headers: noStore });

  // Demo adventures are open. A paid one needs an account that owns it; any backend failure is a 503.
  if (requiresEntitlement(adventure)) {
    try {
      const authz = await authorizeOwner(slug);
      if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status, headers: noStore });
    } catch (err) {
      console.error('answer pack authorisation failed', { slug, error: err instanceof Error ? err.message : 'unknown' });
      return NextResponse.json({ error: 'check failed' }, { status: 503, headers: noStore });
    }
  }

  const pack = await buildAnswerPack(slug);
  if (!pack) return NextResponse.json({ error: 'unknown adventure' }, { status: 404, headers: noStore });
  return NextResponse.json(pack, { headers: noStore });
}
