'use client';

import { useState } from 'react';
import type { Adventure } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { fmt } from '@/i18n/fmt';
import { sfx } from '@/lib/audio';
import type { Action, Progress } from '@/lib/engine/progress';
import { encodeReport } from '@/lib/engine/report';
import type { HeadingRef } from './ChapterView';

/** Tries before the team may give up and see the truth. */
const TRIES_BEFORE_GIVING_UP = 3;

/**
 * The case report, filed before the reveal: every question answered, then checked on the server. Nothing
 * is confirmed until three answers are right together; then the confirmed ones lock. All right: case closed.
 */
export function CaseReportView({ a, p, locale, t, headingRef, dispatch }: { a: Adventure; p: Progress; locale: Locale; t: Dictionary['game']; headingRef: HeadingRef; dispatch: (action: Action) => void }) {
  const r = t.caseReport;
  const slots = a.report!.slots;
  const [status, setStatus] = useState<'idle' | 'checking' | 'pick' | 'none' | 'some' | 'slow' | 'network'>('idle');
  const [lastCount, setLastCount] = useState(0);
  const complete = slots.every((s) => p.reportPicks[s.id]);

  async function file() {
    if (!complete) return setStatus('pick');
    setStatus('checking');
    try {
      const res = await fetch(`/api/game/${a.slug}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: 'report', answer: encodeReport(p.reportPicks) }),
      });
      if (res.status === 429) return setStatus('slow');
      if (!res.ok) throw new Error(String(res.status));
      const { correct, confirmed = [] } = (await res.json()) as { correct: boolean; confirmed?: string[] };
      dispatch({ type: 'reportResult', confirmed, solved: correct });
      if (correct) {
        sfx('unlock');
        setStatus('idle');
      } else {
        sfx(confirmed.length ? 'hint' : 'wrong');
        setLastCount(confirmed.length);
        setStatus(confirmed.length ? 'some' : 'none');
      }
    } catch {
      setStatus('network');
    }
  }

  const message =
    status === 'pick' ? r.pick : status === 'none' ? r.none : status === 'some' ? fmt(r.some, { n: lastCount }) : status === 'slow' ? t.tooFast : status === 'network' ? t.networkError : null;

  return (
    <article className="animate-rise">
      <p className="eyebrow">{a.title[locale]}</p>
      <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
        {r.title}
      </h1>
      <p className="mt-4 text-ivory-dim">{r.intro}</p>

      <ol className="mt-8 space-y-6">
        {slots.map((slot, i) => {
          const locked = p.reportConfirmed.includes(slot.id);
          return (
            <li key={slot.id}>
              <fieldset className={`rounded-2xl border p-4 ${locked ? 'border-success/50 bg-success/[0.06]' : 'border-white/10'}`}>
                <legend className="px-1 text-sm font-semibold text-ivory">
                  {i + 1}. {slot.question[locale]} {locked && <span className="ms-2 text-xs text-success">✓ {r.confirmed}</span>}
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {slot.options.map((o) => {
                    const on = p.reportPicks[slot.id] === o.id;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        aria-pressed={on}
                        disabled={locked}
                        onClick={() => {
                          setStatus('idle');
                          dispatch({ type: 'reportPick', slotId: slot.id, optionId: o.id });
                        }}
                        className={`min-h-[48px] rounded-xl border px-3 py-2 text-start text-sm transition ${on ? (locked ? 'border-success bg-success/20 text-ivory' : 'border-gold bg-gold/15 text-ivory') : 'border-white/10 hover:border-white/30'} disabled:cursor-default`}
                      >
                        {o.label[locale]}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="sticky bottom-0 -mx-4 mt-8 border-t border-white/10 bg-navy/95 px-4 py-4 backdrop-blur">
        {message && (
          <p role="status" className={`mb-3 text-sm ${status === 'some' ? 'text-gold' : 'text-danger'}`}>
            {message}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn-gold" disabled={status === 'checking'} onClick={file}>
            {status === 'checking' ? t.checking : r.file}
          </button>
          {p.reportTries > 0 && <span className="text-xs text-ivory-mute">{fmt(r.tries, { n: p.reportTries })}</span>}
          {p.reportTries >= TRIES_BEFORE_GIVING_UP ? (
            <button type="button" className="btn-ghost ms-auto" onClick={() => dispatch({ type: 'reportReveal' })}>
              {r.reveal}
            </button>
          ) : (
            <span className="ms-auto text-xs text-ivory-mute">{r.revealNote}</span>
          )}
        </div>
      </div>
    </article>
  );
}
