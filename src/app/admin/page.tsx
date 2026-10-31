import { requireAdmin } from '@/lib/admin/access';
import { overviewStats } from '@/lib/admin/data';
import { AdminHeader, Tile } from '@/components/admin/ui';

// Reads live counts per request; never prerendered.
export const dynamic = 'force-dynamic';

export default async function AdminOverview() {
  await requireAdmin();
  const stats = await overviewStats();

  return (
    <>
      <AdminHeader eyebrow="Dashboard" title="Overview" intro="Live figures from the database." />
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
        <Tile k="Players" v={stats.players} />
        <Tile k="New (7 days)" v={stats.newThisWeek} d="magic-link sign-ups" tone="up" />
        <Tile k="Entitlements granted" v={stats.entitlements} d="manual, pre-Stripe" />
        <Tile k="Chapters solved" v={stats.solves.toLocaleString('en')} d="server-recorded" />
      </div>
    </>
  );
}
