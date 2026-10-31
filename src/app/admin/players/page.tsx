import { requireAdmin } from '@/lib/admin/access';
import { listPlayers } from '@/lib/admin/data';
import { AdminHeader, Card, TableScroll } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

const LOCALE_LABEL: Record<string, string> = { de: 'Deutsch', en: 'English', nl: 'Nederlands', ar: 'العربية' };
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en', { day: '2-digit', month: 'short', year: 'numeric' });

export default async function AdminPlayers() {
  await requireAdmin();
  const players = await listPlayers();

  return (
    <>
      <AdminHeader eyebrow="People" title="Players" intro="Read-only. Full data is exported only on the player's own request." />
      <div className="mt-6">
        <Card title="Accounts" intro={`${players.length} player${players.length === 1 ? '' : 's'} · progress is the server-recorded solve count.`}>
          <TableScroll>
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="[&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-[0.72rem] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.08em] [&_th]:text-ivory-mute">
                  <th>Player</th>
                  <th>Language</th>
                  <th>Joined</th>
                  <th>Owns</th>
                  <th>Solved</th>
                </tr>
              </thead>
              <tbody className="[&_td]:border-t [&_td]:border-white/5 [&_td]:px-3 [&_td]:py-2.5">
                {players.map((p) => (
                  <tr key={p.id}>
                    <td className="break-all" dir="ltr">{p.email}</td>
                    <td>{LOCALE_LABEL[p.locale] ?? p.locale}</td>
                    <td className="tabular-nums text-ivory-dim">{fmtDate(p.createdAt)}</td>
                    <td className="tabular-nums">{p.ownedCount || <span className="text-ivory-mute">demo only</span>}</td>
                    <td className="tabular-nums">{p.solved}</td>
                  </tr>
                ))}
                {players.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-ivory-mute">
                      No accounts yet. Players appear here after their first magic-link sign-in.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableScroll>
        </Card>
      </div>
    </>
  );
}
