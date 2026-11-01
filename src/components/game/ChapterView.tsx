'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Adventure, Chapter } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { fmt } from '@/i18n/fmt';
import { sfx, speak, stopSpeaking } from '@/lib/audio';
import type { Action, Progress } from '@/lib/engine/progress';
import { prefersReducedMotion } from '../three/support';
import { DemoMap } from './DemoMap';
import { CheckpointArrival } from './CheckpointArrival';
import { ItemIcon } from './ItemIcon';
import { Artifact3D, Cutscene3D, Lock3D, Map3D, RealMap } from './lazy';
import { CipherWheel } from './puzzles/CipherWheel';
import { Deduction } from './puzzles/Deduction';
import { Interrogation } from './puzzles/Interrogation';
import { Morse } from './puzzles/Morse';
import { OrderStrips } from './puzzles/OrderStrips';
import { Reveal } from './puzzles/Reveal';
import { SymbolEquations } from './SymbolEquations';

type Feedback = 'correct' | 'incorrect' | 'empty' | 'choose' | 'network' | 'slow' | null;
export type HeadingRef = React.RefObject<HTMLHeadingElement | null>;

export function ChapterView({
  a,
  chapter,
  index,
  p,
  locale,
  t,
  three,
  headingRef,
  dispatch,
  onNewItem,
  onHint,
  onClues,
}: {
  a: Adventure;
  chapter: Chapter;
  index: number;
  p: Progress;
  locale: Locale;
  t: Dictionary['game'];
  three: boolean;
  headingRef: HeadingRef;
  dispatch: (action: Action) => void;
  onNewItem: (name: string) => void;
  onHint: () => void;
  onClues: () => void;
}) {
  const total = a.chapters.length;
  const puzzle = chapter.puzzle;
  const [answer, setAnswer] = useState('');
  const [choice, setChoice] = useState<string | null>(null);
  const [order, setOrder] = useState(() => puzzle.pieces?.map((x) => x.id) ?? []);
  const [shift, setShift] = useState(0);
  const [accuse, setAccuse] = useState<{ suspect: string | null; proof: string | null }>({ suspect: null, proof: null });
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [checking, setChecking] = useState(false);
  const [reading, setReading] = useState(false);
  const digits = puzzle.lock?.digits ?? 0;
  const [typing, setTyping] = useState(false);
  const [code, setCode] = useState('0'.repeat(digits));
  const [opening, setOpening] = useState(false);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  // Whether the arrival buttons are on screen (or above it): the phone's "next step" bar hides then.
  const arrival = useRef<HTMLDivElement>(null);
  const [arrivalInView, setArrivalInView] = useState(true);
  useEffect(() => {
    if (p.stage !== 'travel') return;
    // Measured on scroll, resize and layout changes (a map or scene loading above moves the card). An
    // IntersectionObserver missed the change when the bar was tapped while the page was still settling.
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = arrival.current;
      if (el) setArrivalInView(el.getBoundingClientRect().top < window.innerHeight - 96);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    ro?.observe(document.body);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [p.stage]);
  const useLock = three && digits > 0 && !typing;
  const inspect3D = three && !!puzzle.model;
  const hintsShown = p.hintsUsed[chapter.id] ?? 0;
  const reward = chapter.reward ? a.items.find((i) => i.id === chapter.reward) : undefined;
  const inventoryItems = p.inventory.map((id) => a.items.find((i) => i.id === id)).filter((i): i is NonNullable<typeof i> => !!i);
  const isDeduction = puzzle.type === 'deduction';
  const usesChoice = !isDeduction && (!!puzzle.choices || !!puzzle.fromInventory);
  const options = puzzle.fromInventory
    ? inventoryItems.map((item) => ({ id: item.id, label: item.name[locale], icon: item.icon }))
    : (puzzle.choices ?? []).map((c) => ({ id: c.id, label: c.label[locale], icon: undefined }));
  const interviewee = puzzle.interview ? a.people.find((x) => x.id === puzzle.interview!.person) : undefined;

  // While the puzzle is being solved, fetch the files of the scenes that come next.
  const nextIntro = a.chapters[index + 1]?.scenes?.intro;
  const successScene = chapter.scenes?.success;
  useEffect(() => {
    if (!three || p.stage !== 'puzzle') return;
    const id = window.setTimeout(() => {
      void import('../three/cutscene/preload').then((m) => {
        m.preloadScene(successScene);
        m.preloadScene(nextIntro);
      });
    }, 1500);
    return () => window.clearTimeout(id);
  }, [three, p.stage, successScene, nextIntro]);

  function currentGuess(): string | null {
    if (puzzle.type === 'order') return order.join('');
    if (isDeduction) return accuse.suspect && accuse.proof ? `${accuse.suspect}+${accuse.proof}` : null;
    if (usesChoice) return choice;
    if (useLock) return code;
    return answer.trim() || null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const guess = currentGuess();
    if (!guess) {
      setFeedback(usesChoice || isDeduction ? 'choose' : 'empty');
      return;
    }
    setChecking(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/game/${a.slug}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: chapter.id, answer: guess }),
      });
      if (res.status === 429) {
        setFeedback('slow');
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const { correct } = (await res.json()) as { correct: boolean };
      if (correct) {
        setFeedback('correct');
        sfx(useLock ? 'unlock' : 'correct');
        if (useLock) {
          setOpening(true);
          if (!prefersReducedMotion()) await new Promise((r) => setTimeout(r, 1100));
        }
        stopSpeaking();
        dispatch({ type: 'solve', chapterId: chapter.id, reward: chapter.reward });
        if (reward) {
          onNewItem(reward.name[locale]);
          window.setTimeout(() => sfx('item'), 500);
        }
        if (chapter.clues?.length) onClues();
      } else {
        setFeedback('incorrect');
        sfx('wrong');
        dispatch({ type: 'wrong', chapterId: chapter.id });
      }
    } catch {
      setFeedback('network');
    } finally {
      setChecking(false);
    }
  }

  const feedbackText: Record<Exclude<Feedback, null>, string> = {
    correct: t.correct,
    incorrect: t.incorrect,
    empty: t.emptyAnswer,
    choose: t.chooseOne,
    network: t.networkError,
    slow: t.tooFast,
  };

  const readAloud = () => {
    if (reading) {
      stopSpeaking();
      setReading(false);
      return;
    }
    const text = [chapter.title[locale], ...chapter.story[locale], p.stage === 'puzzle' ? puzzle.prompt[locale] : ''].join(' ');
    if (speak(text, locale)) setReading(true);
  };

  const sceneLabels = { play: t.threeD.play, replay: t.threeD.replay, skip: t.threeD.skip, loading: t.threeD.loading };
  const lastHint = puzzle.hints.length >= 3 ? puzzle.hints.length - 1 : -1;

  return (
    <article className="animate-rise" aria-labelledby="chapter-title">
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow">{fmt(t.chapterOf, { n: index + 1, total })}</p>
        <button type="button" onClick={readAloud} className="chip min-h-[32px] hover:border-gold/50" aria-pressed={reading}>
          {reading ? `■ ${t.sound.stop}` : `🔊 ${t.sound.read}`}
        </button>
      </div>
      <h1 id="chapter-title" ref={headingRef} tabIndex={-1} className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">
        {chapter.title[locale]}
      </h1>
      {three && p.stage === 'travel' && chapter.scenes?.intro && (
        <div className="mt-6">
          <Cutscene3D scene={chapter.scenes.intro} label={chapter.title[locale]} labels={sceneLabels} locale={locale} />
        </div>
      )}
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-ivory-dim">
        {chapter.story[locale].map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>

      {p.stage === 'travel' && (
        <section className="mt-10 space-y-4" aria-labelledby="cp-title">
          <h2 id="cp-title" className="eyebrow">
            {t.checkpoint}
          </h2>
          {chapter.checkpoint.coordinates ? (
            <RealMap chapters={a.chapters} current={index} solved={p.solved} locale={locale} labels={{ title: t.map, note: t.mapNote, destination: t.destination, done: t.done }} userPosition={userPosition} />
          ) : three ? (
            <Map3D chapters={a.chapters} current={index} solved={p.solved} locale={locale} labels={{ title: t.map, note: `${t.mapNote} ${t.threeD.drag}`, destination: t.destination, done: t.done }} />
          ) : (
            <DemoMap chapters={a.chapters} current={index} solved={p.solved} locale={locale} labels={{ title: t.map, note: t.mapNote, destination: t.destination, done: t.done }} />
          )}
          <div className="card scroll-mt-24 p-5" ref={arrival}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-semibold">{chapter.checkpoint.name[locale]}</span>
              {chapter.checkpoint.simulated && <span className="chip border-gold/40 text-gold">{t.simulated}</span>}
            </div>
            {chapter.checkpoint.simulated && <p className="mt-2 text-sm text-ivory-dim">{t.simulatedHelp}</p>}
            <p className="mt-3 flex gap-2 text-xs text-ivory-mute">
              <span aria-hidden="true">⚠</span>
              {t.safety}
            </p>
            <CheckpointArrival
              checkpoint={chapter.checkpoint}
              locale={locale}
              t={t}
              onArrive={() => dispatch({ type: 'arrive' })}
              onPosition={setUserPosition}
            />
          </div>
          {/* On a phone the arrival buttons sit below the story and the map. Until they are on screen, a bar
              at the bottom says where to go next and takes the team straight to them. It is portalled to
              <body>: the chapter's entrance animation (a transform) would otherwise pin it to the article. */}
          {!arrivalInView &&
            createPortal(
              <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/25 bg-navy/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:hidden">
                <div className="mx-auto flex max-w-3xl items-center gap-3">
                  <p className="min-w-0 flex-1 truncate text-sm">
                    <span className="text-gold" aria-hidden="true">
                      ◉{' '}
                    </span>
                    {chapter.checkpoint.name[locale]}
                  </p>
                  <button
                    type="button"
                    className="btn-gold min-h-[44px] shrink-0 px-5 py-2 text-sm"
                    onClick={() => arrival.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })}
                  >
                    {t.goToCheckpoint}
                  </button>
                </div>
              </div>,
              document.body,
            )}
        </section>
      )}

      {p.stage === 'puzzle' && (
        <section className="mt-10" aria-labelledby="puzzle-title">
          <h2 id="puzzle-title" className="eyebrow">
            {t.puzzle}
          </h2>
          <form onSubmit={submit} className="card mt-4 space-y-5 p-5 sm:p-6" noValidate>
            {interviewee && puzzle.interview && (
              <Interrogation
                person={interviewee}
                questions={puzzle.interview.questions}
                asked={p.asked[chapter.id] ?? []}
                onAsk={(id) => dispatch({ type: 'ask', chapterId: chapter.id, questionId: id })}
                locale={locale}
                labels={{ ask: t.puzzles.ask, allAsked: t.puzzles.allAsked }}
              />
            )}

            <p className="text-lg text-ivory">{puzzle.prompt[locale]}</p>

            {puzzle.type === 'reveal' && puzzle.material ? (
              <Reveal lines={puzzle.material[locale]} mirrored={puzzle.revealMirrored} locale={locale} surface={a.pursuit ? 'wall' : 'paper'} labels={{ touch: t.puzzles.revealTouch, sweep: t.puzzles.revealSweep }} />
            ) : puzzle.type === 'cipher-wheel' && puzzle.material ? (
              <CipherWheel
                locale={locale}
                shift={shift}
                onShift={setShift}
                lines={puzzle.material[locale]}
                labels={{ left: t.puzzles.wheelLeft, right: t.puzzles.wheelRight, reads: t.puzzles.wheelReads, setting: t.puzzles.wheelSetting }}
              />
            ) : inspect3D && puzzle.model ? (
              <div className="rounded-2xl border border-gold/25 bg-navy p-2">
                <Artifact3D spec={puzzle.model} label={puzzle.prompt[locale]} className="h-64 w-full sm:h-72" spin={0} />
                <p className="pb-1 text-center text-xs text-ivory-mute">{t.threeD.inspect}</p>
                {puzzle.material && (
                  <ul className="sr-only">
                    {puzzle.material[locale].map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              puzzle.material && <Material lines={puzzle.material[locale]} type={puzzle.type} mirror={puzzle.visual === 'mirror'} rtl={locale === 'ar'} />
            )}

            {puzzle.visual === 'symbol-equations' && <SymbolEquations labels={t.symbols} />}
            {puzzle.type === 'morse' && puzzle.morse && <Morse code={puzzle.morse} labels={{ play: t.puzzles.morsePlay, again: t.puzzles.morseAgain, book: t.puzzles.morseBook, playing: t.puzzles.morsePlaying }} />}

            {isDeduction ? (
              <Deduction
                suspects={puzzle.choices ?? []}
                people={a.people}
                items={inventoryItems}
                value={accuse}
                onChange={(v) => {
                  setAccuse(v);
                  setFeedback(null);
                }}
                locale={locale}
                labels={{ who: t.puzzles.who, proof: t.puzzles.proof }}
              />
            ) : puzzle.type === 'order' && puzzle.pieces ? (
              <OrderStrips pieces={puzzle.pieces} order={order} onChange={setOrder} locale={locale} labels={{ up: t.puzzles.up, down: t.puzzles.down, strip: t.puzzles.strip }} />
            ) : useLock ? (
              <div>
                <Lock3D
                  value={code}
                  onChange={(v) => {
                    setCode(v);
                    setFeedback(null);
                  }}
                  open={opening}
                  labels={{ dial: t.threeD.dial, up: t.threeD.up, down: t.threeD.down, hint: t.threeD.lockHint }}
                />
                <button type="button" className="mt-2 text-xs text-ivory-mute underline underline-offset-2 hover:text-ivory" onClick={() => setTyping(true)}>
                  {t.threeD.typeCode}
                </button>
              </div>
            ) : usesChoice ? (
              <fieldset>
                <legend className="text-sm text-ivory-mute">{puzzle.fromInventory ? t.pickItem : t.answer}</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {options.map((o) => (
                    <label key={o.id} className={`flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${choice === o.id ? 'border-gold bg-gold/10' : 'border-white/15 hover:border-white/30'}`}>
                      <input type="radio" name="choice" value={o.id} checked={choice === o.id} onChange={() => setChoice(o.id)} className="accent-[#DDB66A]" />
                      {o.icon && <ItemIcon icon={o.icon} className="h-6 w-6" />}
                      <span>{o.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <label className="grid gap-1.5 text-sm text-ivory-mute">
                {t.answer}
                <input
                  className="field text-lg text-ivory"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  inputMode={puzzle.input === 'numeric' ? 'numeric' : 'text'}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  maxLength={puzzle.input === 'numeric' ? 8 : 60}
                  dir="auto"
                  aria-invalid={feedback === 'incorrect' || feedback === 'empty'}
                  aria-describedby="feedback"
                />
                {three && digits > 0 && (
                  <button type="button" className="justify-self-start text-xs text-ivory-mute underline underline-offset-2 hover:text-ivory" onClick={() => setTyping(false)}>
                    {t.threeD.useDials}
                  </button>
                )}
              </label>
            )}

            <p id="feedback" role="status" aria-live="polite" className="min-h-[1.5rem] text-sm">
              {feedback && <span className={feedback === 'correct' ? 'text-success' : 'text-danger'}>{feedbackText[feedback]}</span>}
            </p>

            <button type="submit" className="btn-gold w-full sm:w-auto" disabled={checking}>
              {checking ? t.checking : t.submit}
            </button>
          </form>

          {/* Hints: a nudge, a clue, then the solution. None in expert mode. */}
          <div className="mt-6 space-y-3">
            {p.mode === 'expert' ? (
              <p className="text-xs text-ivory-mute">{t.expertNoHints}</p>
            ) : (
              <>
                {puzzle.hints.slice(0, hintsShown).map((h, i) => (
                  <div key={i} className={`rounded-xl border p-4 text-sm ${i === lastHint ? 'border-danger/40 bg-danger/5' : 'border-gold/25 bg-gold/[0.06]'}`}>
                    <p className="text-xs font-semibold text-gold">{i === lastHint ? t.solutionLabel : fmt(t.hintLabel, { n: i + 1, total: puzzle.hints.length })}</p>
                    <p className="mt-1 text-ivory">{h[locale]}</p>
                  </div>
                ))}
                {hintsShown < puzzle.hints.length ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => {
                        dispatch({ type: 'hint', chapterId: chapter.id, available: puzzle.hints.length });
                        sfx('hint');
                        onHint();
                      }}
                    >
                      {hintsShown === lastHint ? t.solution : a.pursuit ? a.pursuit.hintLabel[locale] : hintsShown ? t.nextHint : t.hint}
                    </button>
                    {p.mode === 'classic' && <span className="text-xs text-ivory-mute">{t.hintCost}</span>}
                  </div>
                ) : (
                  <p className="text-xs text-ivory-mute">{t.noMoreHints}</p>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {p.stage === 'solved' && (
        <section className="mt-10" aria-labelledby="solved-title">
          <div className="card border-gold/30 p-6">
            <h2 id="solved-title" className="font-display text-3xl text-gold">
              {t.correct}
            </h2>
            {three && chapter.scenes?.success && (
              <div className="mt-4">
                <Cutscene3D scene={chapter.scenes.success} label={chapter.success[locale]} labels={sceneLabels} locale={locale} />
              </div>
            )}
            <p className="mt-3 text-lg text-ivory">{chapter.success[locale]}</p>
            {reward && (
              <div className="mt-5 rounded-xl border border-white/10 bg-navy p-4">
                {three && <Artifact3D spec={reward.model} label={reward.name[locale]} className="mb-3 h-52 w-full" />}
                <div className="flex gap-3">
                  {!three && <ItemIcon icon={reward.icon} />}
                  <div>
                    <p className="text-xs text-gold">{t.inventory}</p>
                    <p className="font-semibold">{reward.name[locale]}</p>
                    <p className="text-sm text-ivory-dim">{reward.description[locale]}</p>
                  </div>
                </div>
              </div>
            )}
            {chapter.clues?.length ? (
              <ul className="mt-5 space-y-2 rounded-xl border border-gold/20 bg-gold/[0.04] p-4 text-sm">
                <li className="text-xs font-semibold text-gold">{t.journal.newClue}</li>
                {chapter.clues.map((c) => (
                  <li key={c.en} className="flex gap-2 text-ivory">
                    <span className="text-gold" aria-hidden="true">✦</span>
                    {c[locale]}
                  </li>
                ))}
              </ul>
            ) : null}
            <button type="button" className="btn-gold mt-6 w-full sm:w-auto" onClick={() => dispatch({ type: 'next', chapterCount: total })}>
              {index + 1 < total ? t.next : t.toFinale}
            </button>
          </div>
        </section>
      )}
    </article>
  );
}

/**
 * Puzzle material: statements as a list, short codes large and spaced, mirrored writing flipped. A screen
 * reader would read mirrored writing plainly and give the answer away, so it is hidden from them; the
 * puzzle's hints lead to the answer instead.
 */
function Material({ lines, type, mirror, rtl }: { lines: string[]; type: Chapter['puzzle']['type']; mirror: boolean; rtl: boolean }) {
  if (mirror) {
    return (
      <div className="rounded-2xl border border-gold/25 bg-navy p-5 text-center" aria-hidden="true">
        {lines.map((line) => (
          <p key={line} className="inline-block -scale-x-100 font-display text-2xl text-gold sm:text-3xl">
            {line}
          </p>
        ))}
      </div>
    );
  }
  if (type === 'logic' || lines.some((l) => l.length > 28 && !NUMBER_CIPHER.test(l))) {
    return (
      <div className="space-y-2">
        {lines.map((line) => (
          <p key={line} className="rounded-xl border border-white/10 bg-navy px-4 py-3">
            {line}
          </p>
        ))}
      </div>
    );
  }
  return (
    // No dir override: in Arabic the number cipher must lay out right to left like the word it spells.
    <div className="rounded-2xl border border-gold/25 bg-navy p-5 text-center">
      {lines.map((line) =>
        NUMBER_CIPHER.test(line) ? (
          <NumberCipher key={line} line={line} rtl={rtl} />
        ) : (
          <p key={line} className="font-mono text-2xl tracking-[0.2em] text-gold sm:text-3xl">
            {line}
          </p>
        ),
      )}
    </div>
  );
}

const NUMBER_CIPHER = /^\d+( · \d+)+$/;

/**
 * A number cipher as one row of tiles. As plain text a long row wrapped on phones, and in Arabic the
 * wrapped right-to-left lines (with a dot left dangling) made the order impossible to read. The tiles never
 * wrap, follow the page direction, and an arrow shows where to start. Screen readers get the plain line.
 */
function NumberCipher({ line, rtl }: { line: string; rtl: boolean }) {
  const numbers = line.split(' · ');
  return (
    <div>
      <p className="sr-only">{line}</p>
      <ol aria-hidden="true" className="flex w-full flex-nowrap justify-center gap-1 sm:gap-2">
        {numbers.map((n, i) => (
          <li
            key={i}
            className="min-w-0 max-w-[3.5rem] flex-1 rounded-lg border border-gold/30 bg-navy-800 py-2 font-mono text-lg text-gold sm:text-3xl"
          >
            {n}
          </li>
        ))}
      </ol>
      <p aria-hidden="true" className="mt-2 text-xl leading-none text-gold/60">
        {rtl ? '←' : '→'}
      </p>
    </div>
  );
}
