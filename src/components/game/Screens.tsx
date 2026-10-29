'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Adventure } from '@/content/types';
import type { Locale } from '@/i18n/config';
import { fmt, type Dictionary } from '@/i18n/dictionary';
import { contextOf, earned } from '@/lib/engine/achievements';
import { MAX_TEAM, MODES, isFinished, pursuitLevel, rankFor, starsFor, totalHints, totalStars, xpFor, type Mode, type Progress } from '@/lib/engine/progress';
import { formatDuration } from '@/lib/format';
import type { HeadingRef } from './ChapterView';
import { Artifact3D } from './lazy';

export function StartScreen({
  a,
  locale,
  t,
  saved,
  headingRef,
  onBegin,
  onRestart,
}: {
  a: Adventure;
  locale: Locale;
  t: Dictionary['game'];
  saved: Progress | null;
  headingRef: HeadingRef;
  onBegin: (team: { name: string; players: number }, mode: Mode) => void;
  onRestart: () => void;
}) {
  const [name, setName] = useState('');
  const [players, setPlayers] = useState(2);
  const [mode, setMode] = useState<Mode>('classic');
  const resumeChapter = saved ? Math.min(saved.chapter + 1, a.chapters.length) : 1;
  return (
    <section className="animate-rise">
      <p className="eyebrow">{a.isDemo ? t.simulated : ''}</p>
      <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
        {saved ? a.title[locale] : t.startTitle}
      </h1>
      <p className="mt-4 text-ivory-dim">{a.tagline[locale]}</p>
      <p className="mt-2 text-sm text-ivory-mute">{t.startText}</p>

      {saved ? (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" className="btn-gold text-base" onClick={() => onBegin(saved.team, saved.mode)}>
            {isFinished(saved) ? t.resultsTitle : fmt(t.continue, { n: resumeChapter })}
          </button>
          <button type="button" className="btn-ghost" onClick={onRestart}>
            {t.restart}
          </button>
        </div>
      ) : (
        <form
          className="card mt-8 grid gap-6 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            onBegin({ name, players }, mode);
          }}
        >
          <label className="grid gap-1.5 text-sm">
            {t.teamName}
            <input className="field" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder={t.teamPlaceholder} autoComplete="off" />
          </label>
          <fieldset>
            <legend className="text-sm">{t.players}</legend>
            <div className="mt-2 flex gap-2">
              {Array.from({ length: MAX_TEAM }, (_, i) => i + 1).map((n) => (
                <label key={n} className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border text-sm font-semibold ${players === n ? 'border-gold bg-gold text-navy' : 'border-white/15'}`}>
                  <input type="radio" name="players" value={n} checked={players === n} onChange={() => setPlayers(n)} className="sr-only" />
                  {n}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm">{t.modes.title}</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {MODES.map((m) => (
                <label key={m} className={`cursor-pointer rounded-xl border p-3 transition ${mode === m ? 'border-gold bg-gold/10' : 'border-white/15 hover:border-white/30'}`}>
                  <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
                  <span className="block font-semibold">{t.modes[m].name}</span>
                  <span className="mt-1 block text-xs text-ivory-dim">{t.modes[m].text}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="text-xs text-ivory-mute">{t.safety}</p>
          <button type="submit" className="btn-gold text-base">
            {t.start}
          </button>
        </form>
      )}
    </section>
  );
}

export function PursuitMeter({ pursuit, hints, locale }: { pursuit: NonNullable<Adventure['pursuit']>; hints: number; locale: Locale }) {
  const level = pursuitLevel(hints, pursuit.levels.length);
  return (
    <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 pb-3 text-xs">
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-danger" aria-hidden="true">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
      <p className="min-w-0 truncate">
        <span className="text-ivory-mute">{pursuit.name[locale]}: </span>
        <span className={level >= 2 ? 'text-danger' : 'text-ivory'}>{pursuit.levels[level]?.[locale]}</span>
      </p>
      <div className="ms-auto flex gap-1" aria-hidden="true">
        {pursuit.levels.map((_, i) => (
          <span key={i} className={`h-1.5 w-5 rounded-full ${i <= level && level > 0 ? 'bg-danger' : 'bg-white/10'}`} />
        ))}
      </div>
    </div>
  );
}

export function Finale({
  a,
  locale,
  t,
  three,
  headingRef,
  onDecide,
}: {
  a: Adventure;
  locale: Locale;
  t: Dictionary['game'];
  three: boolean;
  headingRef: HeadingRef;
  onDecide: (id: string) => void;
}) {
  return (
    <article className="animate-rise">
      <p className="eyebrow">{t.reveal}</p>
      <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
        {a.title[locale]}
      </h1>
      {three && a.ending.artifact && (
        <div className="mt-6 rounded-3xl border border-gold/25 bg-[radial-gradient(circle_at_50%_40%,rgba(221,182,106,0.18),transparent_65%)]">
          <Artifact3D spec={a.ending.artifact} label={a.title[locale]} className="h-64 w-full sm:h-80" spin={0.4} />
        </div>
      )}
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-ivory-dim">
        {a.ending.reveal[locale].map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>
      <section className="card mt-10 p-6" aria-labelledby="decision-title">
        <h2 id="decision-title" className="eyebrow">
          {t.decisionTitle}
        </h2>
        <p className="mt-3 text-lg">{a.ending.decision.prompt[locale]}</p>
        <div className={`mt-5 grid gap-3 ${a.ending.decision.choices.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {a.ending.decision.choices.map((c) => (
            <button key={c.id} type="button" className="btn-ghost min-h-[56px] rounded-2xl text-base" onClick={() => onDecide(c.id)}>
              {c.label[locale]}
            </button>
          ))}
        </div>
      </section>
    </article>
  );
}

function Stars({ n, label }: { n: number; label: string }) {
  return (
    <span className="tracking-wider" role="img" aria-label={label}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < n ? 'text-gold' : 'text-white/15'} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

export function Results({
  a,
  p,
  locale,
  cityName,
  t,
  achievements,
  headingRef,
  onRestart,
}: {
  a: Adventure;
  p: Progress;
  locale: Locale;
  cityName: string;
  t: Dictionary['game'];
  achievements: Dictionary['achievements'];
  headingRef: HeadingRef;
  onRestart: () => void;
}) {
  const choice = a.ending.decision.choices.find((c) => c.id === p.decision);
  const got = earned(p, contextOf(a));
  const team = p.team.name || t.soloTeam;
  const stars = totalStars(p);
  const rank = t.ranks[rankFor(stars, a.chapters.length)];
  return (
    <article className="animate-rise">
      <p className="eyebrow">{t.reveal}</p>
      <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
        {t.resultsTitle}
      </h1>
      {choice && <p className="mt-6 border-s-2 border-gold ps-5 font-display text-xl italic">{choice.epilogue[locale]}</p>}

      <div className="card mt-10 flex flex-col items-center gap-1 p-6 text-center">
        <p className="text-xs text-ivory-mute">{t.rank}</p>
        <p className="font-display text-4xl text-gold">{rank}</p>
        <p className="text-sm text-ivory-dim">
          {t.totalStars}: {stars} / {a.chapters.length * 3} · {t.modes[p.mode].name}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          [t.resultsTime, formatDuration(p.elapsedMs)],
          [t.resultsHints, String(totalHints(p))],
          [t.resultsXp, `${xpFor(p)} XP`],
        ].map(([k, v]) => (
          <div key={k} className="card p-4">
            <dt className="text-xs text-ivory-mute">{k}</dt>
            <dd className="mt-1 font-display text-2xl tabular-nums text-gold">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10" aria-labelledby="chapters-title">
        <h2 id="chapters-title" className="eyebrow">
          {t.chapterStars}
        </h2>
        <ol className="mt-4 divide-y divide-white/5 rounded-2xl border border-white/10">
          {a.chapters.map((c, i) => {
            const n = starsFor(p, c.id);
            return (
              <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <span>
                  <span className="text-ivory-mute">{i + 1}. </span>
                  {c.title[locale]}
                </span>
                <Stars n={n} label={fmt(t.starsOf, { n })} />
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-10" aria-labelledby="ach-title">
        <h2 id="ach-title" className="eyebrow">
          {t.resultsAchievements}
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {got.map((id) => (
            <li key={id} className="card flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold" aria-hidden="true">
                ★
              </span>
              <div>
                <p className="font-semibold">{achievements[id].name}</p>
                <p className="text-xs text-ivory-dim">{achievements[id].text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="certificate" className="mt-10 rounded-3xl border-2 border-gold/50 bg-navy-800 p-8 text-center" aria-labelledby="cert-title">
        <p className="eyebrow">CityQuest</p>
        <h2 id="cert-title" className="mt-2 font-display text-3xl">
          {t.certificate}
        </h2>
        <div className="gold-rule mx-auto mt-4" />
        <p className="mt-4 text-lg">{fmt(t.certificateText, { team, title: a.title[locale], city: cityName })}</p>
        <p className="mt-2 font-display text-2xl text-gold">
          {rank} · {stars} ★
        </p>
        <p className="mt-2 text-sm text-ivory-mute">
          {p.finishedAt ? new Date(p.finishedAt).toLocaleDateString(locale === 'ar' ? 'ar-u-nu-latn' : locale) : ''} · {fmt(t.playersCount, { n: p.team.players })}
        </p>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn-ghost" onClick={() => window.print()}>
          {t.print}
        </button>
        <button type="button" className="btn-gold" onClick={onRestart}>
          {t.playAgain}
        </button>
        <Link href={`/${locale}/adventures`} className="btn-ghost">
          {t.backToAdventures}
        </Link>
      </div>
    </article>
  );
}
