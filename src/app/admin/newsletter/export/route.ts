import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/access';
import { listSubscribers } from '@/lib/admin/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  await requireAdmin();
  const subscribers = await listSubscribers();
  const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [['email', 'status', 'locale', 'consent_at', 'confirmed_at'].join(',')];
  for (const s of subscribers) {
    lines.push([s.email, s.status, s.locale, s.consentAt, s.confirmedAt ?? ''].map(esc).join(','));
  }
  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="newsletter-subscribers.csv"',
      'Cache-Control': 'no-store',
    },
  });
}
