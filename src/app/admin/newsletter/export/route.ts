import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/access';
import { listSubscribers } from '@/lib/admin/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  await requireAdmin();
  const subscribers = await listSubscribers();
  // Quote every field, and neutralise spreadsheet formula injection: a cell starting with = + - @ (or a
  // control char) is prefixed with a single quote so Excel/Sheets treats it as text.
  const esc = (v: string) => {
    const s = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
    return `"${s.replace(/"/g, '""')}"`;
  };
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
