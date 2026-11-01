'use client';

import { useEffect, useRef, useState } from 'react';
import type { Adventure, BoardQuestion } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { fmt } from '@/i18n/fmt';
import { sfx } from '@/lib/audio';
import { boardAnswer, evidenceCards, peopleMet, visibleQuestions, type EvidenceCard } from '@/lib/engine/board';
import type { Progress } from '@/lib/engine/progress';
import { ItemIcon } from './ItemIcon';
import { initials } from './puzzles/Interrogation';

type Status = 'idle' | 'checking' | 'wrong' | 'slow' | 'network';

/**
 * The evidence board, a tab of the case journal. Open questions appear as the story reaches them; the team
 * answers one by naming a person and pinning two pieces of evidence. Everything is a button (tap, click or
 * keyboard), so nothing depends on dragging. Answers are checked on the server like every puzzle.
 */
export function EvidenceBoard({
  a,
  p,
  locale,
  t,
  onDeduced,
}: {
  a: Adventure;
  p: Progress;
  locale: Locale;
  t: Dictionary['game'];
  onDeduced: (questionId: string) => void;
}) {
  const b = t.journal.board;
  const questions = visibleQuestions(a, p);
  const open = questions.filter((q) => !p.deductions.includes(q.id));
  const solved = questions.filter((q) => p.deductions.includes(q.id));
  const [active, setActive] = useState<string | null>(null);
  const current = open.find((q) => q.id === active);
  // Opening or leaving a question starts the panel from the top, not halfway down the last view.
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => {
    top.current?.closest('[role="tabpanel"]')?.scrollTo({ top: 0 });
  }, [active]);

  if (!questions.length) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-ivory-dim">{b.intro}</p>
        <p className="rounded-2xl border border-dashed border-white/15 p-4 text-sm text-ivory-mute">{b.empty}</p>
      </div>
    );
  }

  if (current) {
    return (
      <div ref={top}>
        <Investigation key={current.id} a={a} p={p} q={current} locale={locale} t={t} onBack={() => setActive(null)} onDeduced={onDeduced} />
      </div>
    );
  }

  return (
    <div ref={top} className="space-y-6">
      <p className="text-sm text-ivory-dim">{b.intro}</p>
      {open.length > 0 && (
        <section aria-labelledby="board-open">
          <h3 id="board-open" className="eyebrow">
            {b.open}
          </h3>
          <ul className="mt-3 grid gap-3">
            {open.map((q) => (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => setActive(q.id)}
                  className="group flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-gold/40 bg-gold/[0.06] p-4 text-start transition hover:border-gold hover:bg-gold/10"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/50 font-display text-lg text-gold" aria-hidden="true">
                    ?
                  </span>
                  <span className="flex-1 text-ivory">{q.question[locale]}</span>
                  <span className="text-gold transition group-hover:translate-x-0.5 rtl:rotate-180" aria-hidden="true">
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {solved.length > 0 && (
        <section aria-labelledby="board-solved">
          <h3 id="board-solved" className="eyebrow">
            {b.solved}
          </h3>
          <ul className="mt-3 space-y-3">
            {solved.map((q) => (
              <li key={q.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-ivory-mute">{q.question[locale]}</p>
                <p className="mt-2 flex gap-2 text-ivory">
                  <span className="text-gold" aria-hidden="true">
                    ✓
                  </span>
                  {q.deduction[locale]}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Investigation({
  a,
  p,
  q,
  locale,
  t,
  onBack,
  onDeduced,
}: {
  a: Adventure;
  p: Progress;
  q: BoardQuestion;
  locale: Locale;
  t: Dictionary['game'];
  onBack: () => void;
  onDeduced: (questionId: string) => void;
}) {
  const b = t.journal.board;
  const [person, setPerson] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const people = peopleMet(a, p);
  const cards = evidenceCards(a, p);

  const toggle = (id: string) => {
    setStatus('idle');
    setPinned((now) => (now.includes(id) ? now.filter((x) => x !== id) : [...now, id].slice(-2)));
  };

  async function connect() {
    if (!person || pinned.length !== 2) return;
    setStatus('checking');
    try {
      const res = await fetch(`/api/game/${a.slug}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: `board:${q.id}`, answer: boardAnswer(person, pinned) }),
      });
      if (res.status === 429) return setStatus('slow');
      if (!res.ok) throw new Error(String(res.status));
      const { correct } = (await res.json()) as { correct: boolean };
      if (correct) {
        sfx('correct');
        onDeduced(q.id);
        onBack();
      } else {
        sfx('wrong');
        setStatus('wrong');
      }
    } catch {
      setStatus('network');
    }
  }

  const message = status === 'wrong' ? b.wrong : status === 'slow' ? t.tooFast : status === 'network' ? t.networkError : null;

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="text-sm font-semibold text-gold hover:underline">
        <span className="inline-block rtl:rotate-180" aria-hidden="true">
          ←
        </span>{' '}
        {b.back}
      </button>
      <p className="font-display text-2xl leading-snug text-ivory">{q.question[locale]}</p>

      <fieldset>
        <legend className="eyebrow">{b.who}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {people.map((person_) => {
            const on = person === person_.id;
            return (
              <button
                key={person_.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setStatus('idle');
                  setPerson(on ? null : person_.id);
                }}
                className={`flex min-h-[48px] items-center gap-2 rounded-full border py-1.5 pe-4 ps-1.5 text-sm transition ${on ? 'border-gold bg-gold text-navy' : 'border-white/15 hover:border-white/35'}`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-full font-display ${on ? 'bg-navy/15' : 'bg-gold/15 text-gold'}`} aria-hidden="true">
                  {initials(person_.name[locale])}
                </span>
                {person_.name[locale]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow">
          {b.evidence} <span className="ms-1 normal-case tracking-normal text-ivory-mute">({fmt(b.pinned, { n: pinned.length })})</span>
        </legend>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {cards.map((card) => (
            <li key={card.id}>
              <Card a={a} card={card} locale={locale} t={t} on={pinned.includes(card.id)} onToggle={() => toggle(card.id)} />
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="sticky bottom-0 -mx-5 border-t border-white/10 bg-[#13100c]/95 px-5 py-3 backdrop-blur">
        {message && (
          <p role="status" className="mb-2 text-sm text-danger">
            {message}
          </p>
        )}
        <button type="button" className="btn-gold w-full" disabled={!person || pinned.length !== 2 || status === 'checking'} onClick={connect}>
          {status === 'checking' ? b.checking : b.connect}
        </button>
      </div>
    </div>
  );
}

function Card({ a, card, locale, t, on, onToggle }: { a: Adventure; card: EvidenceCard; locale: Locale; t: Dictionary['game']; on: boolean; onToggle: () => void }) {
  let title = '';
  let detail = '';
  let icon: React.ReactNode = null;
  if (card.kind === 'item') {
    const item = a.items.find((i) => i.id === card.itemId)!;
    title = item.name[locale];
    detail = item.description[locale];
    icon = <ItemIcon icon={item.icon} />;
  } else if (card.kind === 'clue') {
    const chapter = a.chapters.find((c) => c.id === card.chapterId)!;
    title = chapter.clues![card.index]![locale];
    detail = chapter.title[locale];
    icon = <PinIcon />;
  } else {
    const chapter = a.chapters.find((c) => c.id === card.chapterId)!;
    const person = a.people.find((x) => x.id === card.personId);
    const question = chapter.puzzle.interview!.questions.find((x) => x.id === card.questionId)!;
    title = question.a[locale];
    detail = `${person?.name[locale] ?? ''} ${t.journal.board.said}`;
    icon = <QuoteIcon />;
  }
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className={`relative flex h-full min-h-[56px] w-full gap-3 rounded-xl border p-3 text-start transition ${on ? 'border-gold bg-gold/10 shadow-[0_0_0_1px_rgba(221,182,106,0.6)]' : 'border-white/10 bg-white/[0.02] hover:border-white/25'}`}
    >
      {on && <span className="absolute -top-1.5 start-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-gold shadow" aria-hidden="true" />}
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm text-ivory">{title}</span>
        <span className="mt-0.5 block text-xs text-ivory-mute">{detail}</span>
      </span>
    </button>
  );
}

function PinIcon() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 3h6l-1 6 3 3H7l3-3-1-6Z" strokeLinejoin="round" />
        <path d="M12 12v9" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function QuoteIcon() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 font-display text-2xl text-gold" aria-hidden="true">
      “
    </span>
  );
}
