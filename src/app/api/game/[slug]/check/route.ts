import { NextResponse } from 'next/server';
import { resolveGuess } from '@/lib/engine/check.server';
import { authorizePaidAnswer, recordSolve, requiresEntitlement } from '@/lib/engine/entitlement.server';
import { matchesAnswer } from '@/lib/engine/normalize';

const noStore = { headers: { 'Cache-Control': 'no-store' } };

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let body: unknown;
  try {
    body = await req.json();
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
    if (correct && !(await recordSolve(authz.userId, slug, guess.chapterId))) {
      return NextResponse.json({ error: 'could not save progress' }, { status: 503 });
    }
    return NextResponse.json({ correct }, noStore);
  } catch (err) {
    console.error('paid answer check failed', { slug, chapterId: guess.chapterId, err });
    return NextResponse.json({ error: 'check failed' }, { status: 503 });
  }
}
