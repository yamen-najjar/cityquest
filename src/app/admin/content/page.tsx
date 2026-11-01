import type { Metadata } from 'next';
import { allAdventures } from '@/content/adventures';
import { answerKeys } from '@/content/answers.server';
import { missingTranslations } from '@/content/translations';
import { requireAdmin } from '@/lib/admin/access';
import { checkAdventure } from '@/lib/admin/content-check';
import { AdminHeader, Card, Pill, TableScroll } from '@/components/admin/ui';

export const metadata: Metadata = { title: 'Content check' };

// Read-only: the stories are still files in the repository. This page is the first step towards an
// editor: it shows, per adventure, whether everything an editor would have to keep consistent is.
export default async function AdminContent() {
  await requireAdmin();
  const reports = allAdventures.map((a) => checkAdventure(a, answerKeys[a.slug]));
  const errors = reports.reduce((n, r) => n + r.issues.filter((i) => i.level === 'error').length, 0);
  const warnings = reports.reduce((n, r) => n + r.issues.filter((i) => i.level === 'warning').length, 0);
  const missingNl = missingTranslations.nl ?? [];

  return (
    <>
      <AdminHeader
        eyebrow="Stories"
        title="Content check"
        intro="Every adventure checked for what an editor must keep consistent: answers, hints, items, people, the evidence board, story choices and all four languages. Read-only for now — the stories are edited in the repository."
      />
      <div className="mt-6 grid gap-5">
        <Card title="Summary" intro={`${reports.length} adventures · ${errors} error${errors === 1 ? '' : 's'} · ${warnings} warning${warnings === 1 ? '' : 's'} · ${missingNl.length} Dutch translation${missingNl.length === 1 ? '' : 's'} missing`}>
          <TableScroll>
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="[&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-[0.72rem] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.08em] [&_th]:text-ivory-mute">
                  <th>Adventure</th>
                  <th>Status</th>
                  <th>Chapters</th>
                  <th>Puzzle types</th>
                  <th>Clues</th>
                  <th>Board</th>
                  <th>Choices</th>
                  <th>Simulated stops</th>
                  <th>Check</th>
                </tr>
              </thead>
              <tbody className="[&_td]:border-t [&_td]:border-white/5 [&_td]:px-3 [&_td]:py-2.5">
                {reports.map((r) => {
                  const e = r.issues.filter((i) => i.level === 'error').length;
                  const w = r.issues.length - e;
                  return (
                    <tr key={r.slug}>
                      <td>
                        <b className="font-semibold">{r.title}</b>
                        <span className="block text-xs text-ivory-mute">{r.slug}</span>
                      </td>
                      <td>
                        <Pill tone={r.status}>{r.status}</Pill>
                      </td>
                      <td className="tabular-nums">{r.stats.chapters}</td>
                      <td className="tabular-nums">{r.stats.puzzleTypes}</td>
                      <td className="tabular-nums">{r.stats.clues}</td>
                      <td className="tabular-nums">{r.stats.board || '—'}</td>
                      <td className="tabular-nums">{r.stats.choices || '—'}</td>
                      <td className="tabular-nums">
                        {r.stats.simulatedCheckpoints}/{r.stats.chapters}
                      </td>
                      <td>{e ? <Pill tone="danger">{e} error{e === 1 ? '' : 's'}</Pill> : w ? <Pill tone="draft">{w} warning{w === 1 ? '' : 's'}</Pill> : <Pill tone="published">ok</Pill>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableScroll>
        </Card>

        {reports
          .filter((r) => r.issues.length)
          .map((r) => (
            <Card key={r.slug} title={r.title} intro="Errors stop a team from finishing; warnings are worth a look.">
              <ul className="space-y-2 text-sm">
                {r.issues.map((i, n) => (
                  <li key={n} className="flex gap-3">
                    <Pill tone={i.level === 'error' ? 'danger' : 'draft'}>{i.level}</Pill>
                    <span>
                      <span className="text-ivory-mute">{i.where}: </span>
                      {i.message}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}

        {missingNl.length > 0 && (
          <Card title="Missing Dutch translations" intro="English texts with no entry in content/translations/nl.ts; players see the English text instead.">
            <ul className="list-disc space-y-1 ps-5 text-sm text-ivory-dim">
              {missingNl.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Card>
        )}

        <Card title="Towards an editor" intro="What this page is a first step to.">
          <ul className="list-disc space-y-1 ps-5 text-sm text-ivory-dim">
            <li>Next: edit safe text fields (titles, descriptions, hints, translations) in the console, saved as reviewed changes and validated by these same checks before they go live.</li>
            <li>Later: chapters, puzzles, checkpoints and rewards, with version history. Answers stay server-side and the 3D scenes stay in code.</li>
          </ul>
        </Card>
      </div>
    </>
  );
}
