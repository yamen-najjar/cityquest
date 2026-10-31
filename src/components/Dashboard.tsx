'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { fmt, type Dictionary } from '@/i18n/dictionary';
import { ACHIEVEMENTS, earned, type AchievementContext, type AchievementId } from '@/lib/engine/achievements';
import { isFinished, xpFor, type Progress } from '@/lib/engine/progress';
import { localProgressStore } from '@/lib/engine/storage';
import { SYNCED_EVENT } from '@/lib/engine/sync';

export interface DashboardAdventure {
  slug: string;
  title: string;
  chapters: number;
  context: AchievementContext;
}

export function Dashboard({ locale, t, achievements, adventures }: { locale: Locale; t: Dictionary['dashboard']; achievements: Dictionary['achievements']; adventures: DashboardAdventure[] }) {
  const [saved, setSaved] = useState<Progress[] | null>(null);
  useEffect(() => {
    const refresh = () => setSaved(localProgressStore.all());
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
              </li>
            );
          })}
        </ul>
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
