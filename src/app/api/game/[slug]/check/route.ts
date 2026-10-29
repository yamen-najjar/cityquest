import { NextResponse } from 'next/server';
import { checkAnswer } from '@/lib/engine/check.server';

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const result = checkAnswer(slug, body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ correct: result.correct }, { headers: { 'Cache-Control': 'no-store' } });
}
