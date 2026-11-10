'use client';

import { useEffect, useRef, useState } from 'react';
import { useModal } from '@/lib/use-modal';
import { panelId, tabId, TabList } from './Tabs';
import type { Adventure } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { fmt } from '@/i18n/fmt';
import { sfx } from '@/lib/audio';
import { chose, combinationKey, MAX_NOTES, type Action, type Progress } from '@/lib/engine/progress';
import { visibleQuestions } from '@/lib/engine/board';
import { trustWith } from '@/lib/engine/kit';
import { EvidenceBoard } from './EvidenceBoard';
import { LeadsPanel } from './Leads';
import { ItemIcon } from './ItemIcon';
import { initials } from './puzzles/Interrogation';

type Tab = 'board' | 'leads' | 'clues' | 'people' | 'items' | 'notes';

/**
 * The case journal: every clue found so far, the people met (with what they said), the items carried
 * (turn them in 3D, or put two together) and the team's own notes. Opens over the game, like a notebook.
 */
export function Journal({
  a,
  p,
  locale,
  t,
  three,
  dispatch,
  onSaveNotes,
  onView,
  onCombined,
  onNotice,
  onClose,
}: {
  a: Adventure;
  p: Progress;
  locale: Locale;
  t: Dictionary['game'];
  three: boolean;
  dispatch: (action: Action) => void;
  /** Writes the notes to the save immediately. */
  onSaveNotes: (text: string) => void;
  onView: (itemId: string) => void;
  onCombined: (name: string) => void;
  /** Shows a short notice (a lead solved, a secret found). */
  onNotice: (text: string) => void;
  onClose: () => void;
}) {
  // Opens on the board while it has an open question, so a new one is never missed.
  const [tab, setTab] = useState<Tab>(() => (visibleQuestions(a, p).some((q) => !p.deductions.includes(q.id)) ? 'board' : 'clues'));
  const [picked, setPicked] = useState<string[]>([]);
  const [notes, setNotes] = useState(p.notes);
  const reached = (chapterId: string) => a.chapters.findIndex((c) => c.id === chapterId) <= p.chapter;

  // Notes save shortly after typing stops, and at once whenever they could otherwise be lost: the journal
  // closing, the tab being hidden or the page being left or reloaded.
  const notesRef = useRef(notes);
  useEffect(() => {
    notesRef.current = notes;
    const id = window.setTimeout(() => onSaveNotes(notes), 500);
    return () => window.clearTimeout(id);
  }, [notes, onSaveNotes]);
  useEffect(() => {
    const flush = () => onSaveNotes(notesRef.current);
    const onVisibility = () => document.visibilityState === 'hidden' && flush();
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
      flush();
    };
  }, [onSaveNotes]);

  const dialogRef = useRef<HTMLElement>(null);
  useModal(dialogRef, onClose);

  const clues = a.chapters.filter((c) => p.solved.includes(c.id)).flatMap((c) => (c.clues ?? []).map((cl, i) => ({ key: `${c.id}-${i}`, chapter: c.title[locale], text: cl[locale] })));
  const people = a.people.filter((person) => reached(person.appears));
  const items = p.inventory.map((id) => a.items.find((i) => i.id === id)).filter((i): i is NonNullable<typeof i> => !!i);
  const combo = picked.length === 2 ? a.combinations?.find((c) => c.from === combinationKey(picked)) : undefined;

  const openLeads = (a.leads ?? []).filter((l) => p.solved.includes(l.after) && !p.leadsSolved.includes(l.id)).length;
  const openQuestions = visibleQuestions(a, p).filter((q) => !p.deductions.includes(q.id)).length;
  const tabs: { id: Tab; label: string; count?: number }[] = [
    // Only adventures that have deductions show the board.
    ...(a.board?.length ? [{ id: 'board' as const, label: t.journal.board.tab, count: openQuestions }] : []),
    ...(a.leads?.length ? [{ id: 'leads' as const, label: t.leads.tab, count: openLeads }] : []),
    { id: 'clues', label: t.journal.clues, count: clues.length },
    { id: 'people', label: t.journal.people, count: people.length },
    { id: 'items', label: t.journal.items, count: items.length },
    { id: 'notes', label: t.journal.notes },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4" onClick={onClose}>
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="journal-title"
        className="flex max-h-[88dvh] w-full max-w-2xl flex-col rounded-t-3xl border border-gold/25 bg-[#13100c] shadow-card sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <h2 id="journal-title" className="font-display text-2xl text-gold">
            {t.journal.title}
          </h2>
          <button type="button" className="btn-ghost min-h-[36px] px-3 py-1" onClick={onClose} autoFocus>
            {t.threeD.close}
          </button>
        </div>
        <TabList
          prefix="journal"
          labelledBy="journal-title"
          tabs={tabs.map((x) => ({
            id: x.id,
            label: (
              <>
                {x.label}
                {x.count !== undefined && <span className="ms-1.5 text-xs opacity-70">{x.count}</span>}
              </>
            ),
          }))}
          value={tab}
          onChange={(id) => {
            if (id !== tab) sfx('page');
            setTab(id);
          }}
          className="flex shrink-0 gap-1 overflow-x-auto overflow-y-hidden border-b border-white/10 px-3 py-2"
          tabClassName={(on) => `min-h-[44px] whitespace-nowrap rounded-full px-4 py-2 text-sm ${on ? 'bg-gold text-navy' : 'text-ivory-dim hover:text-ivory'}`}
        />
        <div className="flex-1 scroll-pb-24 overflow-y-auto p-5" role="tabpanel" id={panelId('journal')} aria-labelledby={tabId('journal', tab)}>
          {tab === 'board' && <EvidenceBoard a={a} p={p} locale={locale} t={t} onDeduced={(questionId) => dispatch({ type: 'deduce', questionId })} />}

          {tab === 'leads' && <LeadsPanel a={a} p={p} locale={locale} t={t} dispatch={dispatch} onNotice={onNotice} />}

          {tab === 'clues' &&
            (clues.length ? (
              <ol className="space-y-3">
                {clues.map((c, i) => (
                  <li key={c.key} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold">{i + 1}</span>
                    <div>
                      <p className="text-ivory">{c.text}</p>
                      <p className="text-xs text-ivory-mute">{c.chapter}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-ivory-dim">{t.journal.noClues}</p>
            ))}

          {tab === 'people' &&
            (people.length ? (
              <ul className="space-y-4">
                {people.map((person) => {
                  const notes = person.notes.filter((n) => p.solved.includes(n.after) && chose(p, n.when));
                  const statements = a.chapters.flatMap((c) =>
                    c.puzzle.interview?.person === person.id
                      ? (p.asked[c.id] ?? []).map((qid) => c.puzzle.interview!.questions.find((q) => q.id === qid)).filter((q): q is NonNullable<typeof q> => !!q)
                      : [],
                  );
                  return (
                    <li key={person.id} className="rounded-2xl border border-white/10 p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-lg text-gold" aria-hidden="true">
                          {initials(person.name[locale])}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{person.name[locale]}</p>
                          <p className="text-xs text-ivory-mute">{person.role[locale]}</p>
                        </div>
                        {(() => {
                          const trust = trustWith(a, p, person.id);
                          if (!trust) return null;
                          return (
                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${trust > 0 ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                              {trust > 0 ? '♥' : '✕'} {trust > 0 ? t.trust.trusts : t.trust.wary}
                            </span>
                          );
                        })()}
                      </div>
                      {notes.length > 0 && (
                        <ul className="mt-3 list-disc space-y-1 ps-5 text-sm text-ivory-dim">
                          {notes.map((n) => (
                            <li key={n.after}>{n.text[locale]}</li>
                          ))}
                        </ul>
                      )}
                      {statements.length > 0 && (
                        <div className="mt-3 border-t border-white/10 pt-3">
                          <p className="text-xs font-semibold text-gold">{t.journal.statements}</p>
                          <ul className="mt-2 space-y-2 text-sm">
                            {statements.map((q) => (
                              <li key={q.id}>
                                <p className="text-ivory-mute">“{q.q[locale]}”</p>
                                <p className="text-ivory">{q.a[locale]}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-ivory-dim">{t.journal.noPeople}</p>
            ))}

          {tab === 'items' &&
            (items.length ? (
              <div className="space-y-4">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {items.map((it) => {
                    const on = picked.includes(it.id);
                    return (
                      <li key={it.id} className={`rounded-2xl border p-3 transition ${on ? 'border-gold bg-gold/10' : 'border-white/10'}`}>
                        <label className="flex cursor-pointer gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 accent-[#DDB66A]"
                            checked={on}
                            onChange={() => setPicked(on ? picked.filter((x) => x !== it.id) : [...picked, it.id].slice(-2))}
                            aria-label={`${t.journal.combine}: ${it.name[locale]}`}
                          />
                          <ItemIcon icon={it.icon} />
                          <span>
                            <span className="block text-sm font-semibold">{it.name[locale]}</span>
                            <span className="block text-xs text-ivory-dim">{it.description[locale]}</span>
                          </span>
                        </label>
                        {three && (
                          <button type="button" className="mt-2 inline-flex min-h-[32px] items-center text-xs font-semibold text-gold hover:underline" aria-label={`${t.threeD.view}: ${it.name[locale]}`} onClick={() => onView(it.id)}>
                            {t.threeD.view}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white/5 p-3">
                  <p className="flex-1 text-xs text-ivory-mute">{t.puzzles.pick}</p>
                  <button
                    type="button"
                    className="btn-gold min-h-[36px] px-4 py-1 text-sm"
                    disabled={picked.length !== 2}
                    onClick={() => {
                      if (combo) {
                        dispatch({ type: 'combine', from: picked, to: combo.to });
                        sfx('item');
                        const made = a.items.find((i) => i.id === combo.to);
                        if (made) onCombined(made.name[locale]);
                      } else {
                        sfx('wrong');
                      }
                      setPicked([]);
                    }}
                  >
                    {t.journal.combine}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-ivory-dim">{t.inventoryEmpty}</p>
            ))}

          {tab === 'notes' && (
            <label className="block">
              <span className="sr-only">{t.journal.notes}</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={10}
                maxLength={MAX_NOTES}
                placeholder={t.journal.notesPlaceholder}
                className="field min-h-[240px] resize-y bg-[#1b1611] font-display text-lg leading-relaxed"
                dir="auto"
              />
            </label>
          )}
        </div>
      </section>
    </div>
  );
}

export function combinedToast(t: Dictionary['game'], name: string) {
  return fmt(t.journal.combined, { item: name });
}
