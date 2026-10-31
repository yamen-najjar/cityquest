import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/access';
import { listAdventuresAdmin } from '@/lib/admin/data';
import { AdminHeader, Card, Pill, TableScroll } from '@/components/admin/ui';
import { setStatusAction } from './actions';

export const dynamic = 'force-dynamic';

const euro = (cents: number) => `€${(cents / 100).toFixed(2)}`;

export default async function AdminAdventures() {
  await requireAdmin();
  const rows = await listAdventuresAdmin();

  return (
    <>
      <AdminHeader
        eyebrow="Content"
        title="Adventures"
        intro="Stories are authored in code; here you set the publish state, and preview drafts."
      />
      <div className="mt-6 flex flex-col gap-3">
        <Card title="All adventures" intro="Draft adventures are hidden from the public catalogue.">
          <TableScroll>
            <table className="w-full min-w-[620px] border-collapse text-sm">
              <thead>
                <tr className="[&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-[0.72rem] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.08em] [&_th]:text-ivory-mute">
                  <th>Adventure</th>
                  <th>Tier</th>
                  <th>Price</th>
                  <th>Chapters</th>
                  <th>Owners</th>
                  <th>State</th>
                  <th />
                </tr>
              </thead>
              <tbody className="[&_td]:border-t [&_td]:border-white/5 [&_td]:px-3 [&_td]:py-3 [&_td]:align-middle">
                {rows.map((a) => (
                  <tr key={a.slug}>
                    <td>
                      <div className="font-display text-base">{a.title}</div>
                      <div className="text-[0.78rem] text-ivory-mute">
                        <span className="tabular-nums" dir="ltr">{a.slug}</span>
                        {a.isDemo && ' · demo'}
                      </div>
                    </td>
                    <td className="capitalize">{a.tier}</td>
                    <td className="tabular-nums">{euro(a.priceCents)}</td>
                    <td className="tabular-nums">{a.chapters}</td>
                    <td className="tabular-nums">{a.owners}</td>
                    <td><Pill tone={a.status}>{a.status === 'published' ? 'Published' : 'Draft'}</Pill></td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/preview/${a.slug}`} className="btn-ghost min-h-[32px] px-3 py-1 text-xs">Preview</Link>
                        <form action={setStatusAction}>
                          <input type="hidden" name="slug" value={a.slug} />
                          <input type="hidden" name="status" value={a.status === 'published' ? 'draft' : 'published'} />
                          <button type="submit" className="btn-ghost min-h-[32px] px-3 py-1 text-xs">
                            {a.status === 'published' ? 'Set to draft' : 'Publish'}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>
        </Card>
        <p className="text-sm text-ivory-mute">
          Publish state is saved immediately; the public catalogue reflects it at the next deploy (the
          site is statically generated). Preview opens the adventure here regardless of its state.
        </p>
      </div>
    </>
  );
}
