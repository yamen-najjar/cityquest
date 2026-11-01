import { NextResponse } from 'next/server';
import { resolveGuess } from '@/lib/engine/check.server';
import { authorizePaidAnswer, recordSolve, requiresEntitlement } from '@/lib/engine/entitlement.server';
import { matchesAnswer } from '@/lib/engine/normalize';
import { clientKey, createLimiter } from '@/lib/rate-limit';

const noStore = { headers: { 'Cache-Control': 'no-store' } };

// A guess is a chapter id and at most 200 characters; anything much bigger is not a guess.
const MAX_BODY_BYTES = 2048;

// Generous for people (a team makes a handful of guesses a chapter, and several teams can share one
// mobile-network address), far too slow for a script trying every four-digit code.
const perAdventure = createLimiter(40, 60_000);
const perClient = createLimiter(120, 60_000);

function tooMany(retryAfter: number) {
  return NextResponse.json({ error: 'too many requests' }, { status: 429, headers: { 'Retry-After': String(retryAfter), 'Cache-Control': 'no-store' } });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const client = clientKey(req.headers);
  const limited = [perClient.hit(client), perAdventure.hit(`${client}|${slug.slice(0, 80)}`)].find((r) => !r.ok);
  if (limited && !limited.ok) return tooMany(limited.retryAfter);

  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'payload too large' }, { status: 413 });
  }
  let body: unknown;
  try {
    // content-length can be absent or wrong, so the size is checked on what actually arrived as well.
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return NextResponse.json({ error: 'payload too large' }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const guess = resolveGuess(slug, body);
  if (!guess.ok) return NextResponse.json({ error: guess.error }, { status: guess.status });

  // Demo adventures are open: stateless, no account, works offline — exactly as in Phase 1.
  if (!requiresEntitlement(guess.adventure)) {
    return NextResponse.json({ correct: matchesAnswer(guess.answer, guess.accepted) }, noStore);
  }

  // Paid adventure: the caller must own it and have solved every earlier chapter, both verified in the
  // database. Only then is the answer compared, and a correct one recorded server-side. Any backend
  // failure returns 503 rather than a wrong answer or an unrecorded "correct" (which would soft-lock
  // the player at the next chapter), so this path is fail-closed.
  try {
    const authz = await authorizePaidAnswer(slug, guess.adventure, guess.chapterIndex);
    if (!authz.ok) return NextResponse.json({ error: authz.error }, { status: authz.status });

    const correct = matchesAnswer(guess.answer, guess.accepted);
    if (correct && !guess.board && !(await recordSolve(authz.userId, slug, guess.chapterId))) {
      return NextResponse.json({ error: 'could not save progress' }, { status: 503 });
    }
    return NextResponse.json({ correct }, noStore);
  } catch (err) {
    // No player data in the log: the error and where it happened are enough to debug.
    console.error('paid answer check failed', { slug, chapterId: guess.chapterId, error: err instanceof Error ? err.message : 'unknown' });
    return NextResponse.json({ error: 'check failed' }, { status: 503 });
  }
}
