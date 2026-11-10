'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Adventure, Chapter } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { fmt } from '@/i18n/fmt';
import { isMuted, playAmbience, setMuted, sfx, stopAmbience, stopSpeaking, unlockAudio } from '@/lib/audio';
import { contextOf, earned, type AchievementId } from '@/lib/engine/achievements';
import { inbox, unread } from '@/lib/engine/kit';
import { canCatch, fitToAdventure, isFinished, isLost, newProgress, reduce, threatLevel, type Action, type Progress } from '@/lib/engine/progress';
import { localProgressStore as store } from '@/lib/engine/storage';
import { isAtLeastAsFar } from '@/lib/engine/merge';
import { pushLocalDebounced, remoteDelete, SYNCED_EVENT } from '@/lib/engine/sync';
import { formatDuration } from '@/lib/format';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { LogoMark } from '../Logo';
import { use3D } from '../three/support';
import { CaseReportView } from './CaseReport';
import { ChapterView } from './ChapterView';
import { CaughtDialog, DangerPulse } from './Danger';
import { Phone, senderName } from './Phone';
import { Journal, combinedToast } from './Journal';
import { Artifact3D } from './lazy';
import { applyVariant, nextVariant } from '@/lib/engine/variant';
import { Finale, PursuitMeter, Results, StartScreen } from './Screens';
import { useOfflineSupport } from './useOfflineSupport';

const PLAYING_KEY = 'cityquest:playing';

type Toast = { id: number; text: string };

export interface GameProps {
  adventure: Adventure;
  locale: Locale;
  cityName: string;
  t: Dictionary['game'];
  achievements: Dictionary['achievements'];
  languageLabel: string;
}

export function GameClient({ adventure: base, locale, cityName, t, achievements, languageLabel }: GameProps) {
  const [loaded, setLoaded] = useState(false);
  const [p, setP] = useState<Progress | null>(null);
  // The truth the next new game tells: a replay of a solved case draws the next variant.
  const [upcoming, setUpcoming] = useState<string | null>(null);
  const variantId = p ? p.variant : upcoming;
  const a = useMemo(() => applyVariant(base, variantId), [base, variantId]);
  const [onStart, setOnStart] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const [showTimer, setShowTimer] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [muted, setMutedState] = useState(false);
  const earnedRef = useRef<AchievementId[] | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ctx = useMemo(() => contextOf(a), [a]);
  const [three, setThree] = use3D();
  // Gets the adventure ready for play without reception, and tells when there is none.
  const offlineSupport = useOfflineSupport(base);
  const [viewing, setViewing] = useState<string | null>(null);
  // The save as last written, for writes that cannot wait for a render (the page being closed).
  const latest = useRef<Progress | null>(null);
  // A save read from storage or the account is fitted to the story as it is now (see fitToAdventure).
  const fit = useCallback(
    (saved: Progress | null) =>
      saved &&
      fitToAdventure(
        saved,
        base.chapters.map((c) => c.id),
        base.items.map((i) => i.id),
        (base.board ?? []).map((q) => q.id),
      ),
    [base],
  );

  // Load saved progress once, in the browser. A reload or a language switch in the same tab goes straight
  // back into the game; a new visit first shows Continue / Start over.
  useEffect(() => {
    const saved = fit(store.load(a.slug));
    setP(saved);
    setMutedState(isMuted());
    try {
      if (saved && window.sessionStorage.getItem(PLAYING_KEY) === a.slug) setOnStart(false);
    } catch {
      /* no session storage: show the start screen */
    }
    setLoaded(true);
  }, [a.slug, fit]);

  useEffect(() => {
    if (!loaded) return;
    try {
      if (onStart) window.sessionStorage.removeItem(PLAYING_KEY);
      else window.sessionStorage.setItem(PLAYING_KEY, a.slug);
    } catch {
      /* not essential */
    }
  }, [loaded, onStart, a.slug]);

  // Save after every change: instantly to this device, and mirrored up to the account when signed in.
  useEffect(() => {
    latest.current = p;
    if (p) {
      store.save(p);
      pushLocalDebounced(p);
    }
  }, [p]);

  // Journal notes are written through at once (not after the next render), so closing the journal or the
  // page straight after typing never loses the last words.
  const saveNotes = useCallback((text: string) => {
    const current = latest.current;
    if (!current || current.notes === text) return;
    const next = reduce(current, { type: 'notes', text });
    latest.current = next;
    store.save(next);
    setP((prev) => (prev ? reduce(prev, { type: 'notes', text }) : prev));
  }, []);

  // When a reconcile updates this device's save, keep the screen in step. On the start / continue screen
  // we adopt it outright; mid-game we adopt only if the account is strictly further, so an older account
  // save can never throw away the game being played right now.
  useEffect(() => {
    const onSynced = () => {
      const fresh = fit(store.load(a.slug));
      if (!fresh) return;
      setP((prev) => {
        if (!prev || onStart) return fresh;
        const furtherThanNow = isAtLeastAsFar(fresh, prev) && !isAtLeastAsFar(prev, fresh);
        return furtherThanNow ? fresh : prev;
      });
    };
    window.addEventListener(SYNCED_EVENT, onSynced);
    return () => window.removeEventListener(SYNCED_EVENT, onSynced);
  }, [onStart, a.slug, fit]);

  const dispatch = useCallback((action: Action) => {
    setP((prev) => (prev ? reduce(reduce(prev, { type: 'tick', now: Date.now() }), action) : prev));
  }, []);

  // The clock: a display tick every second while a timer is on screen (re-rendering the game every second
  // for nothing costs battery), and the saved playing time every 15 seconds and when the tab hides.
  const playing = !!p && !onStart && !isFinished(p);

  // The phone: a message arriving buzzes, chimes and shows who it is from (not while the phone is open).
  const unreadCount = p && !onStart ? unread(a, p).length : 0;
  const seenArrivals = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!p || onStart) return;
    const arrived = inbox(a, p);
    if (seenArrivals.current) {
      const fresh = arrived.filter((m) => !seenArrivals.current!.has(m.id) && !p.phoneRead.includes(m.id));
      if (fresh.length && !phoneOpen) {
        sfx('item');
        navigator.vibrate?.([60, 60, 60]);
        toast(fmt(t.phone.newMessage, { name: senderName(a, fresh[0]!.from, locale, t) }));
      }
    }
    seenArrivals.current = new Set(arrived.map((m) => m.id));
  }, [p, onStart, a, phoneOpen, locale, t]); // eslint-disable-line react-hooks/exhaustive-deps

  // The pursuer: how close he is, felt as well as shown. Every step closer beats like a heart (and the
  // phone buzzes); when he reaches the team in classic or expert mode, he catches them (see Pursuit.caught).
  const levels = a.pursuit?.levels.length ?? 0;
  const level = p && a.pursuit ? threatLevel(p, levels) : 0;
  const lastLevel = useRef(level);
  useEffect(() => {
    if (playing && level > lastLevel.current) {
      sfx('heartbeat');
      navigator.vibrate?.([90, 120, 90]);
    }
    lastLevel.current = level;
  }, [level, playing]);
  useEffect(() => {
    if (!p || !playing || !a.pursuit?.caught || !canCatch(p, levels)) return;
    sfx('stinger');
    navigator.vibrate?.([220, 120, 220]);
    dispatch({ type: 'caught', now: Date.now() });
  }, [p, playing, a.pursuit, levels, dispatch]);
  const clockShown = playing && (showTimer || p?.mode === 'expert');
  useEffect(() => {
    if (!clockShown) return;
    setNow(Date.now());
    const show = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(show);
  }, [clockShown]);
  useEffect(() => {
    if (!playing) return;
    const save = window.setInterval(() => setP((prev) => (prev ? reduce(prev, { type: 'tick', now: Date.now() }) : prev)), 15000);
    const onHide = () => {
      if (document.visibilityState === 'hidden') setP((prev) => (prev ? reduce(prev, { type: 'tick', now: Date.now() }) : prev));
    };
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.clearInterval(save);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [playing]);

  // The sound of the place the chapter is set in. Stops when the game screen goes away.
  const chapter: Chapter | undefined = p && !onStart ? a.chapters[p.chapter] : undefined;
  const ambienceSet = chapter?.scenes?.intro?.set ?? (p && !onStart ? (a.pursuit ? 'alley' : 'archive') : null);
  useEffect(() => {
    if (ambienceSet) playAmbience(ambienceSet);
  }, [ambienceSet]);
  useEffect(
    () => () => {
      stopAmbience();
      stopSpeaking();
    },
    [],
  );

  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { id, text }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 5000);
  }, []);

  // Announce achievements the moment they are earned (not the ones a resumed game already had).
  useEffect(() => {
    if (!p) {
      earnedRef.current = null;
      return;
    }
    const current = earned(p, ctx);
    if (earnedRef.current) {
      for (const id of current) if (!earnedRef.current.includes(id)) toast(fmt(t.achievement, { name: achievements[id].name }));
    }
    earnedRef.current = current;
  }, [p, ctx, achievements, t.achievement, toast]);

  // Move focus to the new heading at each step, so screen readers and keyboards follow the story.
  const stepKey = p ? `${onStart}-${p.chapter}-${p.stage}-${p.decision ?? ''}-${p.reportDone ?? ''}` : 'start';
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: false });
    window.scrollTo({ top: 0 });
    stopSpeaking();
  }, [stepKey]);

  const restart = () => {
    setUpcoming(p ? (isFinished(p) ? nextVariant(base, p.variant) : p.variant) : upcoming);
    store.clear(a.slug);
    void remoteDelete(a.slug); // also drop the account save, so the next reconcile cannot resurrect it
    earnedRef.current = null;
    setP(null);
    setConfirmRestart(false);
    setOnStart(true);
  };

  if (!loaded) {
    return <div className="min-h-dvh" aria-busy="true" />;
  }

  const total = a.chapters.length;
  const timerOn = showTimer || p?.mode === 'expert';
  const elapsed = p ? p.elapsedMs + (playing ? Math.max(0, Math.min(now - p.lastActiveAt, 5 * 60 * 1000)) : 0) : 0;
  const itemsById = Object.fromEntries(a.items.map((i) => [i.id, i]));
  const viewed = viewing ? itemsById[viewing] : undefined;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Game bar */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-navy/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4">
          <Link href={`/${locale}/adventures/${a.slug}`} className="flex items-center gap-2 text-sm text-ivory-dim hover:text-ivory" aria-label={t.exit}>
            <LogoMark className="h-7 w-7" />
            <span className="hidden sm:inline">{t.exit}</span>
          </Link>
          <p className="min-w-0 flex-1 truncate text-center font-display text-lg max-sm:invisible">{a.title[locale]}</p>
          <button
            type="button"
            onClick={() => {
              const next = !muted;
              setMuted(next);
              setMutedState(next);
              if (!next) unlockAudio();
            }}
            aria-pressed={!muted}
            title={muted ? t.sound.off : t.sound.on}
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm ${muted ? 'border-white/15 text-ivory-mute' : 'border-gold bg-gold/15 text-gold'}`}
          >
            <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
            <span className="sr-only">{muted ? t.sound.off : t.sound.on}</span>
          </button>
          <button
            type="button"
            onClick={() => setThree(!three)}
            aria-pressed={three}
            title={three ? t.threeD.on : t.threeD.off}
            className={`min-h-[36px] rounded-full border px-2.5 text-xs font-bold ${three ? 'border-gold bg-gold/15 text-gold' : 'border-white/15 text-ivory-mute'}`}
          >
            {t.threeD.toggle}
            <span className="sr-only">{three ? t.threeD.on : t.threeD.off}</span>
          </button>
          <LanguageSwitcher locale={locale} label={languageLabel} />
        </div>
        {offlineSupport.offline && (
          <p role="status" className="border-t border-gold/20 bg-gold/10 px-4 py-1.5 text-center text-xs text-gold">
            {t.offline.active}
          </p>
        )}
        {p && !onStart && (
          <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 pb-3">
            <ol className="flex flex-1 gap-1" aria-label={t.progress}>
              {a.chapters.map((c, i) => {
                const done = p.solved.includes(c.id);
                return (
                  <li key={c.id} className={`h-1.5 flex-1 rounded-full ${done ? 'bg-gold' : i === p.chapter ? 'bg-ivory/60' : 'bg-white/10'}`}>
                    <span className="sr-only">
                      {fmt(t.chapter, { n: i + 1 })}: {done ? t.done : i === p.chapter ? '…' : '–'}
                    </span>
                  </li>
                );
              })}
            </ol>
            {a.phone?.length ? (
              <button type="button" onClick={() => setPhoneOpen(true)} className="chip relative min-h-[36px] hover:border-gold/50" aria-haspopup="dialog">
                📱 {t.phone.open}
                {unreadCount > 0 && <span className="rounded-full bg-danger px-1.5 text-[10px] font-bold text-white">{unreadCount}</span>}
              </button>
            ) : null}
            <button type="button" onClick={() => setJournalOpen(true)} className="chip min-h-[36px] hover:border-gold/50" aria-haspopup="dialog">
              📜 {t.journal.open}
              <span className="rounded-full bg-gold px-1.5 text-[10px] font-bold text-navy">{p.inventory.length}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowTimer((s) => !s)}
              className="chip min-h-[36px] tabular-nums hover:border-gold/50"
              aria-pressed={timerOn}
              disabled={p.mode === 'expert'}
            >
              {timerOn ? formatDuration(elapsed) : t.timer}
              <span className="sr-only">{timerOn ? t.hideTimer : t.showTimer}</span>
            </button>
          </div>
        )}
        {p && !onStart && a.pursuit && !isFinished(p) && <PursuitMeter pursuit={a.pursuit} level={level} locale={locale} />}
      </header>

      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-8">
        {onStart || !p ? (
          <StartScreen
            a={a}
            locale={locale}
            t={t}
            saved={p}
            offlineReady={offlineSupport.ready}
            headingRef={headingRef}
            onBegin={(team, mode) => {
              unlockAudio();
              if (!p) setP(newProgress(a.slug, team, Date.now(), mode, upcoming));
              else setP(reduce(p, { type: 'tick', now: Date.now() }));
              setOnStart(false);
            }}
            onRestart={() => setConfirmRestart(true)}
          />
        ) : isLost(p) ? (
          <Results a={a} p={p} locale={locale} cityName={cityName} t={t} achievements={achievements} headingRef={headingRef} onRestart={() => setConfirmRestart(true)} />
        ) : chapter ? (
          <ChapterView
            key={chapter.id}
            a={a}
            chapter={chapter}
            index={p.chapter}
            p={p}
            locale={locale}
            t={t}
            three={three}
            headingRef={headingRef}
            dispatch={dispatch}
            onNewItem={(name) => toast(fmt(t.newItem, { item: name }))}
            onHint={() => {
              if (a.pursuit) toast(a.pursuit.closer[locale]);
            }}
            onClues={() => toast(t.journal.newClue)}
          />
        ) : !p.decision && a.report && !p.reportDone ? (
          <CaseReportView a={a} p={p} locale={locale} t={t} headingRef={headingRef} dispatch={dispatch} />
        ) : !p.decision ? (
          <Finale a={a} locale={locale} t={t} three={three} headingRef={headingRef} choices={p.choices} onDecide={(id) => dispatch({ type: 'decide', choiceId: id, chapterCount: total, now: Date.now() })} />
        ) : (
          <Results a={a} p={p} locale={locale} cityName={cityName} t={t} achievements={achievements} headingRef={headingRef} onRestart={() => setConfirmRestart(true)} />
        )}
      </main>

      {playing && a.pursuit && (
        <DangerPulse level={level} levels={levels} label={fmt(t.danger.near, { level: a.pursuit.levels[level]?.[locale] ?? '' })} />
      )}
      {p?.recovering && a.pursuit?.caught && (
        <CaughtDialog
          a={a}
          p={p}
          locale={locale}
          t={t}
          onRecovered={(message) => {
            dispatch({ type: 'recover' });
            if (message) toast(message);
          }}
        />
      )}

      {phoneOpen && p && <Phone a={a} p={p} locale={locale} t={t} dispatch={dispatch} onNotice={toast} onClose={() => setPhoneOpen(false)} />}

      {journalOpen && p && (
        <Journal
          a={a}
          p={p}
          locale={locale}
          t={t}
          three={three}
          dispatch={dispatch}
          onSaveNotes={saveNotes}
          onView={(id) => setViewing(id)}
          onCombined={(name) => toast(combinedToast(t, name))}
          onNotice={toast}
          onClose={() => setJournalOpen(false)}
        />
      )}

      {viewed && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 sm:items-center" onClick={() => setViewing(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="viewer-title"
            className="card w-full max-w-md p-5"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === 'Escape' && setViewing(null)}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="viewer-title" className="font-display text-2xl">
                {viewed.name[locale]}
              </h2>
              <button type="button" className="btn-ghost min-h-[36px] px-3 py-1" onClick={() => setViewing(null)} autoFocus>
                {t.threeD.close}
              </button>
            </div>
            <Artifact3D spec={viewed.model} label={viewed.name[locale]} className="mt-3 h-72 w-full bg-navy" />
            <p className="mt-2 text-center text-xs text-ivory-mute">{t.threeD.drag}</p>
            <p className="mt-3 text-sm text-ivory-dim">{viewed.description[locale]}</p>
          </div>
        </div>
      )}

      {confirmRestart && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div role="alertdialog" aria-modal="true" aria-labelledby="restart-title" className="card w-full max-w-sm p-6">
            <p id="restart-title" className="text-ivory">
              {t.restartConfirm}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" className="btn-ghost" onClick={() => setConfirmRestart(false)} autoFocus>
                {t.cancel}
              </button>
              <button type="button" className="btn-gold" onClick={restart}>
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex flex-col items-center gap-2 px-4">
        {toasts.map((x) => (
          <p key={x.id} className="animate-rise rounded-full border border-gold/40 bg-navy-800 px-4 py-2 text-sm text-gold shadow-glow">
            {x.text}
          </p>
        ))}
      </div>
    </div>
  );
}
