import { requireAdmin } from '@/lib/admin/access';
import { listEntitlements } from '@/lib/admin/data';
import { adventures } from '@/content/adventures';
import { AdminHeader, Card, Pill, TableScroll } from '@/components/admin/ui';
import { GrantForm } from '@/components/admin/GrantForm';
import { revokeAction } from './actions';

export const dynamic = 'force-dynamic';

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en', { day: '2-digit', month: 'short', year: 'numeric' });

export default async function AdminAccess() {
  await requireAdmin();
  const entitlements = await listEntitlements();
  const options = adventures.map((a) => ({ slug: a.slug, title: a.title.en }));
  const titleOf = new Map(options.map((o) => [o.slug, o.title]));

  return (
    <>
      <AdminHeader
        eyebrow="Access"
        title="Entitlements & orders"
        intro="Grant access by email now; Stripe fills orders automatically in Phase 3."
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card title="Granted entitlements" intro="Who may play each paid adventure.">
          <TableScroll>
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="[&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-[0.72rem] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.08em] [&_th]:text-ivory-mute">
                  <th>Player</th>
                  <th>Adventure</th>
                  <th>Source</th>
                  <th>Granted</th>
                  <th />
                </tr>
              </thead>
              <tbody className="[&_td]:border-t [&_td]:border-white/5 [&_td]:px-3 [&_td]:py-2.5">
                {entitlements.map((e) => (
                  <tr key={`${e.userId}:${e.adventure}`}>
                    <td className="break-all" dir="ltr">{e.email}</td>
                    <td>{titleOf.get(e.adventure) ?? e.adventure}</td>
                    <td><Pill tone="off">{e.source}</Pill></td>
                    <td className="tabular-nums text-ivory-dim">{fmtDate(e.grantedAt)}</td>
                    <td className="text-right">
                      <form action={revokeAction}>
                        <input type="hidden" name="userId" value={e.userId} />
                        <input type="hidden" name="adventure" value={e.adventure} />
                        <button type="submit" className="btn-ghost min-h-[32px] px-3 py-1 text-xs">Revoke</button>
                      </form>
                    </td>
                  </tr>
                ))}
                {entitlements.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-ivory-mute">
                      No entitlements yet. Grant one on the right, or wait for Phase 3 purchases.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableScroll>
        </Card>
        <Card title="Grant access" intro="Adds an entitlement row server-side.">
          <GrantForm adventures={options} />
        </Card>
      </div>
    </>
  );
}
