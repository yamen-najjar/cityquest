'use client';

import { useEffect, useRef, useState } from 'react';
import { useModal } from '@/lib/use-modal';
import { panelId, tabId, TabList } from './Tabs';
import type { Adventure, PhoneMessage } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { fmt } from '@/i18n/fmt';
import { sfx, speak, stopSpeaking } from '@/lib/audio';
import { documentsHeld, inbox, pagesHeld } from '@/lib/engine/kit';
import type { Action, Progress } from '@/lib/engine/progress';
import { CaseDocumentView, WebPageView } from './CaseFiles';
import { initials } from './puzzles/Interrogation';

type Tab = 'messages' | 'files' | 'web';

/** The name a message shows: the person's, or "Unknown number". */
export function senderName(a: Adventure, from: string, locale: Locale, t: Dictionary['game']): string {
  return a.people.find((x) => x.id === from)?.name[locale] ?? t.phone.unknown;
}

/**
 * The in-game phone: messages from the story's characters (and a withheld number), voice messages in an
 * acted voice, the documents and web pages they send, and replies that change what comes back. Opening
 * it marks everything that arrived as read.
 */
export function Phone({
  a,
  p,
  locale,
  t,
  dispatch,
  onNotice,
  onClose,
}: {
  a: Adventure;
  p: Progress;
  locale: Locale;
  t: Dictionary['game'];
  dispatch: (action: Action) => void;
  onNotice: (text: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>('messages');
  const [openDoc, setOpenDoc] = useState<string | null>(null);
  const [openPage, setOpenPage] = useState<string | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const messages = inbox(a, p);
  const docs = documentsHeld(a, p);
  const pages = pagesHeld(a, p);

  // Everything that has arrived is seen once the phone is open.
  const unseen = messages.filter((m) => !p.phoneRead.includes(m.id)).map((m) => m.id);
  useEffect(() => {
    if (unseen.length) dispatch({ type: 'read', ids: unseen });
  }, [unseen.join(','), dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const dialogRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useModal(dialogRef, onClose);
  useEffect(() => () => stopSpeaking(), []);

  const play = (m: PhoneMessage) => {
    if (playing === m.id) {
      stopSpeaking();
      setPlaying(null);
      return;
    }
    stopSpeaking();
    (m.lines ?? []).forEach((line, i) => speak(line.text[locale], locale, line.voice, i > 0));
    setPlaying(m.id);
  };

  const discover = (id: string) => {
    dispatch({ type: 'discover', secretId: id });
    sfx('item');
    const secret = a.secrets?.find((s) => s.id === id);
    if (secret) onNotice(fmt(t.phone.secretFound, { name: secret.title[locale] }));
  };

  const doc = openDoc ? docs.find((d) => d.id === openDoc) : undefined;
  const page = openPage ? pages.find((pg) => pg.id === openPage) : undefined;
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'messages', label: t.phone.messages, count: messages.length },
    { id: 'files', label: t.phone.files, count: docs.length },
    { id: 'web', label: t.phone.web, count: pages.length },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4" onClick={onClose}>
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-title"
        className="flex max-h-[92dvh] w-full max-w-md flex-col rounded-t-[2rem] border-4 border-[#1d2433] bg-[#0b0f17] shadow-card sm:rounded-[2.4rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <h2 id="phone-title" className="font-display text-2xl text-gold">
            {t.phone.title}
          </h2>
          <button type="button" className="btn-ghost min-h-[36px] px-3 py-1" onClick={onClose} autoFocus>
            {t.threeD.close}
          </button>
        </div>
        <TabList
          prefix="phone"
          labelledBy="phone-title"
          tabs={tabs.map((x) => ({
            id: x.id,
            label: (
              <>
                {x.label} <span className="ms-1 text-xs opacity-70">{x.count}</span>
              </>
            ),
          }))}
          value={tab}
          onChange={(id) => {
            setTab(id);
            setOpenDoc(null);
            setOpenPage(null);
          }}
          className="flex shrink-0 gap-1 overflow-x-auto overflow-y-hidden border-b border-white/10 px-3 py-2"
          tabClassName={(on) => `min-h-[44px] whitespace-nowrap rounded-full px-4 py-2 text-sm ${on ? 'bg-gold text-navy' : 'text-ivory-dim hover:text-ivory'}`}
        />

        <div ref={panelRef} tabIndex={-1} className="flex-1 overflow-y-auto p-4" role="tabpanel" id={panelId('phone')} aria-labelledby={tabId('phone', tab)}>
          {(doc || page) && (
            <div className="space-y-3">
              <button
                type="button"
                className="min-h-[44px] text-sm font-semibold text-gold hover:underline"
                autoFocus
                onClick={() => {
                  setOpenDoc(null);
                  setOpenPage(null);
                  panelRef.current?.focus();
                }}
              >
                <span className="inline-block rtl:rotate-180" aria-hidden="true">
                  ←
                </span>{' '}
                {t.phone.back}
              </button>
              {doc && <CaseDocumentView doc={doc} locale={locale} t={t} found={p.secrets} onSecret={discover} />}
              {page && <WebPageView page={page} locale={locale} t={t} />}
            </div>
          )}

          {!doc && !page && tab === 'messages' && (
            <ol className="space-y-4" aria-live="polite">
              {messages.length === 0 && <li className="text-sm text-ivory-dim">{t.phone.empty}</li>}
              {messages.map((m) => {
                const name = senderName(a, m.from, locale, t);
                const reply = m.replies?.find((r) => r.id === p.replies[m.id]);
                return (
                  <li key={m.id} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display ${m.from === 'unknown' ? 'bg-danger/20 text-danger' : 'bg-gold/15 text-gold'}`}
                        aria-hidden="true"
                      >
                        {m.from === 'unknown' ? '?' : initials(name)}
                      </span>
                      <div className="min-w-0 max-w-[85%] rounded-2xl rounded-ss-sm bg-[#1a2232] px-4 py-2.5">
                        <p className="text-xs font-semibold text-gold">{name}</p>
                        {m.kind === 'call' && (
                          <div className="mt-1 flex items-center gap-2">
                            <button type="button" className="btn-ghost min-h-[36px] px-3 py-1 text-xs" onClick={() => play(m)}>
                              <span aria-hidden="true">{playing === m.id ? '■' : '▶'}</span> {playing === m.id ? t.phone.stop : t.phone.play}
                            </button>
                            <span className="text-xs text-ivory-mute">{t.phone.voice}</span>
                          </div>
                        )}
                        <p className="mt-1 text-sm text-ivory">{m.text[locale]}</p>
                        {m.kind === 'call' && (
                          <ul className="mt-2 space-y-1 border-s-2 border-white/15 ps-2 text-xs italic text-ivory-dim">
                            {(m.lines ?? []).map((l, i) => (
                              <li key={i}>“{l.text[locale]}”</li>
                            ))}
                          </ul>
                        )}
                        {m.document && (
                          <button type="button" className="mt-2 inline-flex min-h-[32px] items-center gap-1 text-xs font-semibold text-gold hover:underline" onClick={() => setOpenDoc(m.document!)}>
                            <span aria-hidden="true">📄</span> {t.phone.openFile}
                          </button>
                        )}
                        {m.page && (
                          <button type="button" className="mt-2 inline-flex min-h-[32px] items-center gap-1 text-xs font-semibold text-gold hover:underline" onClick={() => setOpenPage(m.page!)}>
                            <span aria-hidden="true">🔗</span> {t.phone.openPage}
                          </button>
                        )}
                      </div>
                    </div>
                    {m.replies && !reply && (
                      <div className="flex flex-wrap justify-end gap-2">
                        {m.replies.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            className="rounded-full border border-gold/40 px-3 py-1.5 text-sm text-gold hover:bg-gold/10"
                            onClick={() => {
                              sfx('page');
                              dispatch({ type: 'reply', messageId: m.id, replyId: r.id });
                            }}
                          >
                            {r.label[locale]}
                          </button>
                        ))}
                      </div>
                    )}
                    {reply && (
                      <>
                        <p className="ms-auto w-fit max-w-[80%] rounded-2xl rounded-se-sm bg-gold/20 px-4 py-2 text-sm text-ivory">
                          <span className="sr-only">{t.phone.you}: </span>
                          {reply.label[locale]}
                        </p>
                        <p className="w-fit max-w-[80%] rounded-2xl rounded-ss-sm bg-[#1a2232] px-4 py-2 text-sm text-ivory">
                          <span className="sr-only">{name}: </span>
                          {reply.answer[locale]}
                        </p>
                        {reply.trust ? <p className="text-center text-[11px] italic text-ivory-mute">{fmt(t.trust.remembers, { name })}</p> : null}
                      </>
                    )}
                  </li>
                );
              })}
              {messages.some((m) => m.kind === 'call') && <li className="text-[11px] text-ivory-mute">{t.phone.acted}</li>}
            </ol>
          )}

          {!doc && !page && tab === 'files' && (
            <ul className="space-y-2">
              {docs.length === 0 && <li className="text-sm text-ivory-dim">{t.phone.noFiles}</li>}
              {docs.map((d) => (
                <li key={d.id}>
                  <button type="button" className="flex w-full items-center gap-3 rounded-xl border border-white/10 p-3 text-start hover:border-white/25" onClick={() => setOpenDoc(d.id)}>
                    <span aria-hidden="true">📄</span>
                    <span className="text-sm text-ivory">{d.title[locale]}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!doc && !page && tab === 'web' && (
            <ul className="space-y-2">
              {pages.length === 0 && <li className="text-sm text-ivory-dim">{t.phone.noPages}</li>}
              {pages.map((pg) => (
                <li key={pg.id}>
                  <button type="button" className="flex w-full items-center gap-3 rounded-xl border border-white/10 p-3 text-start hover:border-white/25" onClick={() => setOpenPage(pg.id)}>
                    <span aria-hidden="true">🔗</span>
                    <span className="min-w-0">
                      <span className="block text-sm text-ivory">{pg.title[locale]}</span>
                      <span className="block truncate text-xs text-ivory-mute" dir="ltr">
                        {pg.address}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
