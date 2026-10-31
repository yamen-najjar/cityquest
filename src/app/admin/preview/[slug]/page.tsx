import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GameClient } from '@/components/game/GameClient';
import { getAdventure } from '@/content/adventures';
import { getCity } from '@/content/cities';
import { getDictionary } from '@/i18n/dictionary';
import { requireAdmin } from '@/lib/admin/access';

// Admin-only preview: opens any adventure (including drafts) in English, so it can be checked before
// publishing. Dynamic + gated; never prerendered or indexed.
export const dynamic = 'force-dynamic';

export default async function AdminPreview({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const a = getAdventure(slug);
  if (!a) notFound();
  const t = getDictionary('en');

  return (
    <div className="-mx-4 sm:-mx-6">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-gold/10 px-4 py-2 text-sm text-gold-soft sm:px-6">
        <span>Draft preview — {a.title.en}. Progress is stored in this browser only.</span>
        <Link href="/admin/adventures" className="btn-ghost min-h-[32px] whitespace-nowrap px-3 py-1 text-xs">
          Back to adventures
        </Link>
      </div>
      <GameClient
        adventure={a}
        locale="en"
        cityName={getCity(a.city)?.name.en ?? a.city}
        t={t.game}
        achievements={t.achievements}
        languageLabel={t.nav.language}
      />
    </div>
  );
}
