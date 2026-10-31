import { requireAdmin } from '@/lib/admin/access';
import { listSubscribers, newsletterStats } from '@/lib/admin/data';
import { AdminHeader, Card, Pill, Tile, TableScroll } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

const LOCALE_LABEL: Record<string, string> = { de: 'Deutsch', en: 'English', nl: 'Nederlands', ar: 'العربية' };
const PILL: Record<string, { tone: string; label: string }> = {
  confirmed: { tone: 'published', label: 'Confirmed' },
  pending: { tone: 'draft', label: 'Pending' },
  unsubscribed: { tone: 'danger', label: 'Unsubscribed' },
};
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en', { day: '2-digit', month: 'short', year: 'numeric' });

export default async function AdminNewsletter() {
  await requireAdmin();
  const [stats, subscribers] = await Promise.all([newsletterStats(), listSubscribers()]);

  return (
    <>
      <AdminHeader
        eyebrow="GDPR"
        title="Newsletter"
        intro="Double opt-in — an address counts only once the emailed link is confirmed."
        actions={
          <a href="/admin/newsletter/export" className="btn-ghost min-h-[36px] px-4 text-sm">
            Export CSV
          </a>
        }
      />
      <div className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3.5">
          <Tile k="Confirmed" v={stats.confirmed} />
          <Tile k="Pending" v={stats.pending} />
          <Tile k="Unsubscribed" v={stats.unsubscribed} />
        </div>
        <Card title="Subscribers" intro="Email is stored server-side and never exposed to the browser.">
          <TableScroll>
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="[&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-[0.72rem] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.08em] [&_th]:text-ivory-mute">
                  <th>Email</th>
                  <th>Status</th>
                  <th>Language</th>
                  <th>Consent</th>
                </tr>
              </thead>
              <tbody className="[&_td]:border-t [&_td]:border-white/5 [&_td]:px-3 [&_td]:py-2.5">
                {subscribers.map((s) => {
                  const p = PILL[s.status] ?? { tone: 'off', label: s.status };
                  return (
                    <tr key={s.email}>
                      <td className="break-all" dir="ltr">{s.email}</td>
                      <td><Pill tone={p.tone}>{p.label}</Pill></td>
                      <td>{LOCALE_LABEL[s.locale] ?? s.locale}</td>
                      <td className="tabular-nums text-ivory-dim">{fmtDate(s.consentAt)}</td>
                    </tr>
                  );
                })}
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-ivory-mute">
                      No subscribers yet.
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
