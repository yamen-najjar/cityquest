'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { fmt } from '@/i18n/fmt';
import { ACHIEVEMENTS, earned, type AchievementContext, type AchievementId } from '@/lib/engine/achievements';
import { daysUntil, letterAt, tokenEarned } from '@/lib/engine/meta';
import { isFinished, xpFor, type Progress } from '@/lib/engine/progress';
import { localProgressStore } from '@/lib/engine/storage';
import { SYNCED_EVENT } from '@/lib/engine/sync-events';

export interface DashboardAdventure {
  slug: string;
  title: string;
  chapters: number;
  context: AchievementContext;
  secrets: string[];
  token?: { order: number; fragment: string };
  letter?: { from: string; text: string[] };
}

export interface DashboardMeta {
  title: string;
  intro: string;
  from: string;
  solved: string[];
}

export function Dashboard({
  locale,
  t,
  achievements,
  adventures,
  meta,
}: {
  locale: Locale;
  t: Dictionary['dashboard'];
  achievements: Dictionary['achievements'];
  adventures: DashboardAdventure[];
  meta: DashboardMeta;
}) {
  const [saved, setSaved] = useState<Progress[] | null>(null);
  const [now, setNow] = useState(0);
  const [openLetter, setOpenLetter] = useState<string | null>(null);
  useEffect(() => {
    const refresh = () => {
      setSaved(localProgressStore.all());
      setNow(Date.now());
    };
    refresh();
    // A sign-in reconcile may pull in adventures played on other devices; reflect them live.
    window.addEventListener(SYNCED_EVENT, refresh);
    return () => window.removeEventListener(SYNCED_EVENT, refresh);
  }, []);

  if (!saved) return <div className="min-h-[40vh]" aria-busy="true" />;

  const known = saved.filter((p) => adventures.some((a) => a.slug === p.adventure));
  const totalXp = known.reduce((s, p) => s + xpFor(p), 0);
  const got = new Set<AchievementId>(
    known.flatMap((p) => {
      const ctx = adventures.find((a) => a.slug === p.adventure)?.context;
      return ctx ? earned(p, ctx) : [];
    }),
  );
  const signs = adventures
    .filter((a) => a.token)
    .sort((x, y) => x.token!.order - y.token!.order)
    .map((a) => {
      const p = known.find((s) => s.adventure === a.slug);
      return { slug: a.slug, title: a.title, fragment: a.token!.fragment, found: !!p && tokenEarned(p, a.secrets) };
    });
  const foundSigns = signs.filter((s) => s.found).length;

  return (
    <div className="mt-8 space-y-12">
      {known.length === 0 ? (
        <div className="card p-8">
          <p className="text-ivory-dim">{t.empty}</p>
          <Link href={`/${locale}/adventures`} className="btn-gold mt-5">
            {t.start}
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {known.map((p) => {
            const a = adventures.find((x) => x.slug === p.adventure)!;
            const done = isFinished(p);
            const at = a.letter ? letterAt(p) : null;
            const arrived = at !== null && now >= at;
            return (
              <li key={p.adventure} className="card p-6">
                <span className={`chip ${done ? 'border-gold/40 text-gold' : ''}`}>{done ? t.completed : t.inProgress}</span>
                <h2 className="mt-3 font-display text-2xl font-semibold">{a.title}</h2>
                <p className="mt-1 text-sm text-ivory-dim">{fmt(t.chapters, { n: p.solved.length, total: a.chapters })}</p>
                <div className="mt-4 h-1.5 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${(p.solved.length / a.chapters) * 100}%` }} />
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="font-display text-xl text-gold">{xpFor(p)} XP</span>
                  <Link href={`/${locale}/play/${p.adventure}`} className="btn-gold">
                    {done ? t.view : t.continue}
                  </Link>
                </div>
                {at !== null &&
                  a.letter &&
                  (arrived ? (
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <button
                        type="button"
                        aria-expanded={openLetter === a.slug}
                        onClick={() => setOpenLetter(openLetter === a.slug ? null : a.slug)}
                        className="flex w-full items-center gap-2 text-start text-sm font-semibold text-gold"
                      >
                        <span aria-hidden="true">✉️</span> {openLetter === a.slug ? t.letterClose : t.letterArrived}
                      </button>
                      {openLetter === a.slug && (
                        <div className="mt-4 rounded-xl bg-[#efe6d2] p-5 font-display text-lg leading-relaxed text-[#2b2116]">
                          {a.letter.text.map((line, i) => (
                            <p key={i} className="mt-3 first:mt-0">
                              {line}
                            </p>
                          ))}
                          <p className="mt-4 text-end italic">— {a.letter.from}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-5 border-t border-white/10 pt-4 text-xs text-ivory-mute">
                      <span aria-hidden="true">✉️ </span>
                      {fmt(t.letterOnWay, { n: daysUntil(at, now) })}
                    </p>
                  ))}
              </li>
            );
          })}
        </ul>
      )}

      {signs.length > 0 && (
        <section aria-labelledby="meta-title" className="rounded-3xl border border-gold/25 bg-gold/[0.03] p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="meta-title" className="font-display text-3xl font-semibold">
              <span aria-hidden="true">🏮 </span>
              {meta.title}
            </h2>
            <p className="text-sm text-ivory-dim">{fmt(t.metaProgress, { n: foundSigns, total: signs.length })}</p>
          </div>
          <p className="mt-3 text-ivory-dim">{meta.intro}</p>
          <ol className="mt-5 grid gap-3 sm:grid-cols-3">
            {signs.map((s) => (
              <li key={s.slug} className={`rounded-2xl border p-4 text-center ${s.found ? 'border-gold/50 bg-gold/10' : 'border-dashed border-white/15'}`}>
                <p className={`font-display text-xl ${s.found ? 'text-gold' : 'text-ivory-mute'}`}>{s.found ? s.fragment : '· · ·'}</p>
                <p className="mt-1 text-xs text-ivory-mute">
                  {s.title}
                  {!s.found && ` · ${t.metaLocked}`}
                </p>
              </li>
            ))}
          </ol>
          {foundSigns === signs.length ? (
            <div className="mt-6 rounded-xl bg-[#efe6d2] p-5 font-display text-lg leading-relaxed text-[#2b2116]">
              {meta.solved.map((line, i) => (
                <p key={i} className="mt-3 first:mt-0">
                  {line}
                </p>
              ))}
              <p className="mt-4 text-end italic">— {meta.from}</p>
            </div>
          ) : (
            <p className="mt-4 text-xs text-ivory-mute">{t.metaHint}</p>
          )}
        </section>
      )}

      <section aria-labelledby="ach">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="ach" className="font-display text-3xl font-semibold">
            {t.achievements}
          </h2>
          <p className="text-sm text-ivory-dim">
            {t.totalXp}: <span className="font-display text-xl text-gold">{totalXp} XP</span>
          </p>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((id) => {
            const has = got.has(id);
            return (
              <li key={id} className={`card flex items-center gap-3 p-4 ${has ? '' : 'opacity-50'}`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${has ? 'bg-gold/15 text-gold' : 'bg-white/5 text-ivory-mute'}`} aria-hidden="true">
                  {has ? '★' : '☆'}
                </span>
                <div>
                  <p className="font-semibold">{achievements[id].name}</p>
                  <p className="text-xs text-ivory-dim">{has ? achievements[id].text : `${t.locked} · ${achievements[id].text}`}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
