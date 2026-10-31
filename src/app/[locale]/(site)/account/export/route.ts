import { NextResponse } from 'next/server';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// GDPR data access/portability: returns a JSON copy of the signed-in user's own data as a download.
// Only the caller's own rows, filtered by the verified session user id.
export async function GET() {
  if (!isAdminConfigured()) return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'sign in required' }, { status: 401 });

  const admin = createAdminClient();
  const email = user.email?.toLowerCase();
  const [profile, progress, entitlements, solves, newsletter] = await Promise.all([
    admin.from('profiles').select('display_name, locale, email, created_at').eq('id', user.id).maybeSingle(),
    admin.from('progress').select('adventure, data, updated_at').eq('user_id', user.id),
    admin.from('entitlements').select('adventure, source, granted_at').eq('user_id', user.id),
    admin.from('solves').select('adventure, chapter_id, solved_at').eq('user_id', user.id),
    email
      ? admin.from('newsletter_subscribers').select('status, locale, consent_at, confirmed_at, unsubscribed_at').eq('email', email).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    account: { id: user.id, email: user.email, createdAt: user.created_at },
    profile: profile.data,
    progress: progress.data ?? [],
    entitlements: entitlements.data ?? [],
    solves: solves.data ?? [],
    newsletter: newsletter.data ?? null,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="cityquest-data.json"',
      'Cache-Control': 'no-store',
    },
  });
}
