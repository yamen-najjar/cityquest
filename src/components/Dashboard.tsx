'use client';

import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { Arrow } from '@/components/Marks';
import { PhotoCaption, PhotoImage } from '@/components/Photo';
import { RouteSchematic } from '@/components/RouteSchematic';
import type { PhotoId } from '@/content/photos';
import { intlLocale, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { fmt } from '@/i18n/fmt';
import { ACHIEVEMENTS, earned, type AchievementContext, type AchievementId } from '@/lib/engine/achievements';
import { daysUntil, letterAt, tokenEarned } from '@/lib/engine/meta';
import { isFinished, isLost, rankFor, totalStars, xpFor, type Mode, type Progress } from '@/lib/engine/progress';
import { localProgressStore } from '@/lib/engine/storage';
import { SYNCED_EVENT } from '@/lib/engine/sync-events';

export interface DashboardAdventure {
  slug: string;
  title: string;
  city: string;
  chapters: number;
  photo: PhotoId;
  /** Where the team starts, short ("Korenmarkt, Arnhem"). */
  start: string;
  /** The line shown for a story that has not been started: chapters, city, duration, age. */
  notStartedLine: string;
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

export interface DashboardLabels {
  modes: Record<Mode, string>;
  ranks: string[];
  /** The label of a case that was lost. */
  lost: string;
  routeStart: string;
  credit: string;
}

type Entry = {
  key: string;
  at: number | null;
  kind: 'started' | 'progress' | 'letter' | 'ahead-letter' | 'unstarted';
  p?: Progress;
  a: DashboardAdventure;
};

export function Dashboard({
  locale,
  t,
  achievements,
  adventures,
  meta,
  labels,
}: {
  locale: Locale;
  t: Dictionary['dashboard'];
  achievements: Dictionary['achievements'];
  adventures: DashboardAdventure[];
  meta: DashboardMeta;
  labels: DashboardLabels;
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

  const lead = <p className="db-lead">{t.intro}</p>;

  if (!saved) {
    return (
      <div className="db" aria-busy="true">
        <header className="db-top tp-wrap">
          <h1 className="db-h1">{t.title}</h1>
          {lead}
        </header>
        <div className="tp-wrap db-skel" aria-hidden="true">
          <span className="db-skel__row" />
          <span className="db-skel__row" />
          <span className="db-skel__row" />
        </div>
      </div>
    );
  }

  const known = saved.filter((p) => adventures.some((a) => a.slug === p.adventure));
  const byAdventure = (slug: string) => adventures.find((a) => a.slug === slug)!;
  const totalXp = known.reduce((s, p) => s + xpFor(p), 0);
  const got = new Set<AchievementId>(
    known.flatMap((p) => {
      const ctx = byAdventure(p.adventure).context;
      return earned(p, ctx);
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

  // The page's one big thing: the unfinished adventure played most recently.
  const next = known.filter((p) => !isFinished(p)).sort((x, y) => y.lastActiveAt - x.lastActiveAt)[0];
  const nextAdventure = next ? byAdventure(next.adventure) : null;

  // The logbook: everything the saved progress says happened, newest first; stories not begun at the end.
  const entries: Entry[] = [];
  for (const p of known) {
    const a = byAdventure(p.adventure);
    entries.push({ key: `${p.adventure}:start`, at: p.startedAt, kind: 'started', p, a });
    entries.push({ key: `${p.adventure}:progress`, at: isFinished(p) ? (p.finishedAt ?? p.lastActiveAt) : p.lastActiveAt, kind: 'progress', p, a });
    const at = a.letter ? letterAt(p) : null;
    if (at !== null) entries.push({ key: `${p.adventure}:letter`, at, kind: now >= at ? 'letter' : 'ahead-letter', p, a });
  }
  // Newest first; when times tie (a fresh case starts and is last played at the same moment) the state comes before the start.
  const rankOf: Record<Entry['kind'], number> = { 'ahead-letter': 0, progress: 1, letter: 2, started: 3, unstarted: 4 };
  entries.sort((x, y) => (y.at ?? 0) - (x.at ?? 0) || rankOf[x.kind] - rankOf[y.kind]);
  for (const a of adventures) if (!known.some((p) => p.adventure === a.slug)) entries.push({ key: `${a.slug}:none`, at: null, kind: 'unstarted', a });

  const dateFmt = new Intl.DateTimeFormat(intlLocale[locale], { day: 'numeric', month: 'long' });
  const dateYearFmt = new Intl.DateTimeFormat(intlLocale[locale], { day: 'numeric', month: 'long', year: 'numeric' });
  const timeFmt = new Intl.DateTimeFormat(intlLocale[locale], { hour: '2-digit', minute: '2-digit' });
  const thisYear = new Date(now).getFullYear();
  const dayOf = (at: number) => (new Date(at).getFullYear() === thisYear ? dateFmt : dateYearFmt).format(at);
  const duration = (ms: number) => {
    const minutes = Math.round(ms / 60000);
    const h = Math.floor(minutes / 60);
    return h > 0 ? fmt(t.hoursMinutes, { h, m: minutes % 60 }) : fmt(t.minutesOnly, { m: minutes });
  };
  const playHref = (slug: string) => `/${locale}/play/${slug}`;
  const routeLabels = (n: number, total: number) => ({ aria: fmt(t.routeProgress, { n, total }), start: labels.routeStart, endings: '' });

  const facts = (items: string[]) => (
    <p className="tp-facts">
      {items.map((f, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="tp-sep" aria-hidden="true">&nbsp;· </span>}
          <span>{f}</span>
        </Fragment>
      ))}
    </p>
  );
  const teamFacts = (p: Progress) => [
    fmt(p.team.players === 1 ? t.teamLineOne : t.teamLine, { name: p.team.name, n: p.team.players }),
    labels.modes[p.mode],
    ...(p.elapsedMs >= 60000 ? [duration(p.elapsedMs)] : []),
  ];

  const renderEntry = (e: Entry) => {
    const { a, p } = e;
    const isAhead = e.kind === 'ahead-letter';
    const when = e.at === null ? { day: t.notStartedWhen, sub: t.notStartedSub } : { day: dayOf(e.at), sub: isAhead ? '' : timeFmt.format(e.at) };
    let body: React.ReactNode = null;

    if (e.kind === 'started' && p) {
      body = (
        <>
          <h3>{fmt(t.started, { title: a.title })}</h3>
          <p className="tp-muted">{a.start}.</p>
        </>
      );
    } else if (e.kind === 'progress' && p) {
      const lost = isLost(p);
      const done = isFinished(p) && !lost;
      const stars = totalStars(p);
      const rank = labels.ranks[rankFor(stars, a.chapters)];
      const sign = a.token && tokenEarned(p, a.secrets) ? a.token.fragment : null;
      body = (
        <>
          <span className="db-eyebrow">{lost ? labels.lost : done ? t.completed : t.inProgress}</span>
          <h3>
            <Link href={playHref(a.slug)}>{a.title}</Link>
          </h3>
          <p>
            {fmt(t.progressLine, { done: p.solved.length, total: a.chapters, stars, max: a.chapters * 3, xp: xpFor(p) })}
            {done && rank ? ` ${fmt(t.rankLine, { rank })}` : ''}
          </p>
          {facts(teamFacts(p))}
          {sign && <p className="db-sign">{fmt(t.tokenFound, { fragment: sign })}</p>}
          {done && (
            <figure className="db-fig">
              <PhotoImage id={a.photo} locale={locale} sizes="(max-width: 900px) 100vw, 420px" />
              <PhotoCaption id={a.photo} locale={locale} template={labels.credit} />
            </figure>
          )}
          {done && <RouteSchematic slug={a.slug} solved={p.solved.length} labels={routeLabels(p.solved.length, a.chapters)} />}
          <div className="db-actions">
            <Link className={done ? 'tp-btn tp-btn--quiet' : 'tp-textlink'} href={playHref(a.slug)}>
              {lost || done ? t.view : t.continue}
              {!done && !lost && <Arrow />}
            </Link>
          </div>
        </>
      );
    } else if ((e.kind === 'letter' || e.kind === 'ahead-letter') && p && a.letter) {
      const at = letterAt(p)!;
      const open = openLetter === a.slug;
      body = (
        <>
          <span className="db-eyebrow">{isAhead ? t.eyebrowWay : t.eyebrowArrived}</span>
          <h3>{fmt(t.letterFrom, { from: a.letter.from })}</h3>
          {isAhead ? (
            <p>{fmt(t.letterOnWay, { n: daysUntil(at, now) })}</p>
          ) : (
            <>
              <div className="db-actions">
                <button type="button" className="tp-textlink db-fold" aria-expanded={open} aria-controls={`letter-${a.slug}`} onClick={() => setOpenLetter(open ? null : a.slug)}>
                  {open ? t.letterClose : t.letterArrived}
                </button>
              </div>
              <div className="db-letter" id={`letter-${a.slug}`} hidden={!open}>
                {a.letter.text.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                <p className="db-letter__from">— {a.letter.from}</p>
              </div>
            </>
          )}
        </>
      );
    } else {
      body = (
        <>
          <h3>
            <Link href={`/${locale}/adventures/${a.slug}`}>{a.title}</Link>
          </h3>
          <p className="tp-muted">{a.notStartedLine}</p>
          <figure className="db-fig">
            <PhotoImage id={a.photo} locale={locale} sizes="(max-width: 900px) 100vw, 420px" />
            <PhotoCaption id={a.photo} locale={locale} template={labels.credit} />
          </figure>
          <RouteSchematic slug={a.slug} solved={0} labels={routeLabels(0, a.chapters)} />
        </>
      );
    }

    return (
      <li key={e.key} className={`db-ent${isAhead ? ' db-ent--ahead' : ''}`}>
        <div className="db-when">
          <strong>{when.day}</strong>
          {when.sub}
        </div>
        <div className="db-what">{body}</div>
      </li>
    );
  };

  return (
    <div className="db">
      {next && nextAdventure ? (
        <section className="db-next" aria-labelledby="volgende">
          <PhotoImage id={nextAdventure.photo} locale={locale} sizes="100vw" className="db-next__img" priority />
          <PhotoCaption id={nextAdventure.photo} locale={locale} template={labels.credit} as="p" />
          <div className="tp-wrap db-next__in">
            <div>
              <h1 className="db-eyebrow db-next__h1">{t.title}</h1>
              <h2 id="volgende" className="db-next__title">
                {nextAdventure.title}
              </h2>
              <p className="db-lead db-next__lead">
                {fmt(t.continueLead, { n: Math.min(next.solved.length + 1, nextAdventure.chapters), total: nextAdventure.chapters })}
                {totalStars(next) > 0 || xpFor(next) > 0 ? ` ${fmt(t.continueSoFar, { stars: totalStars(next), max: nextAdventure.chapters * 3, xp: xpFor(next) })}` : ''}
              </p>
              <div className="db-actions db-actions--band">
                <Link className="tp-btn" href={playHref(next.adventure)}>
                  {t.continue}
                  <Arrow />
                </Link>
                <span className="db-status">
                  {t.inProgress} · {nextAdventure.city} · {labels.modes[next.mode]}
                </span>
              </div>
            </div>
            <div className="db-next__rt">
              <RouteSchematic slug={next.adventure} solved={next.solved.length} labels={routeLabels(next.solved.length, nextAdventure.chapters)} />
            </div>
          </div>
        </section>
      ) : (
        <header className="db-top tp-wrap">
          <h1 className="db-h1">{t.title}</h1>
          {lead}
        </header>
      )}

      {known.length === 0 && (
        <section className="tp-wrap db-empty" aria-label={t.empty}>
          <p className="db-empty__text">{t.empty}</p>
          <Link href={`/${locale}/adventures`} className="tp-btn">
            {t.start}
            <Arrow />
          </Link>
        </section>
      )}

      {known.length > 0 && (
        <section className="tp-wrap" aria-labelledby="logboek">
          <div className="db-head">
            <h2 id="logboek" className="db-h2">
              {t.logbook}
            </h2>
            {next && <p className="db-lead db-lead--small">{t.intro}</p>}
          </div>
          <ol className="db-log">{entries.map(renderEntry)}</ol>
          <p className="db-note">{t.logbookNote}</p>
        </section>
      )}

      <section className="tp-wrap db-record" aria-label={t.recordLabel}>
        {signs.length > 0 && (
          <div aria-labelledby="meta-title" role="group">
            <h2 id="meta-title" className="db-h2 db-h2--sub">
              {meta.title}
            </h2>
            <p className="db-sub">{fmt(t.metaProgress, { n: foundSigns, total: signs.length })}</p>
            <p className="tp-muted db-intro">{meta.intro}</p>
            <ol className="db-signs">
              {signs.map((s) => (
                <li key={s.slug} className={s.found ? 'is-found' : ''}>
                  <p className="db-signs__frag">{s.found ? s.fragment : '· · ·'}</p>
                  <p className="db-signs__story">
                    {s.title}
                    {!s.found && ` · ${t.metaLocked}`}
                  </p>
                </li>
              ))}
            </ol>
            {foundSigns === signs.length ? (
              <div className="db-letter">
                {meta.solved.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                <p className="db-letter__from">— {meta.from}</p>
              </div>
            ) : (
              <p className="db-note">{t.metaHint}</p>
            )}
          </div>
        )}
        <div aria-labelledby="ach" role="group" className="db-record__ach">
          <h2 id="ach" className="db-h2 db-h2--sub">
            {t.achievements}
          </h2>
          <p className="db-sub">
            {t.totalXp}: <strong className="db-xp">{totalXp} XP</strong> · {fmt(t.achievementsCount, { n: got.size, total: ACHIEVEMENTS.length })}
          </p>
          <ul className="db-ach">
            {ACHIEVEMENTS.map((id) => {
              const has = got.has(id);
              return (
                <li key={id} className={has ? '' : 'is-locked'}>
                  {has ? (
                    <svg className="db-mark db-mark--yes" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <circle cx="12" cy="12" r="9.5" />
                      <path d="M7.8 12.3l3 3 5.6-6" />
                    </svg>
                  ) : (
                    <svg className="db-mark" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  )}
                  <div>
                    <p className="db-ach__name">{achievements[id].name}</p>
                    <p className="db-ach__text">{has ? achievements[id].text : `${t.locked} · ${achievements[id].text}`}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
