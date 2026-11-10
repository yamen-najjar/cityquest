'use client';

import { useEffect, useRef, useState } from 'react';
import type { Adventure, Facade, Lead } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { fmt } from '@/i18n/fmt';
import { sfx, speak, stopSpeaking } from '@/lib/audio';
import { checkAnswer } from '@/lib/engine/answer-client';
import { confrontAnswer, timelineAnswer, visibleLeads } from '@/lib/engine/kit';
import type { Action, Progress } from '@/lib/engine/progress';
import { CaseDocumentView } from './CaseFiles';
import { OrderStrips } from './puzzles/OrderStrips';

type Status = 'idle' | 'checking' | 'wrong' | 'slow' | 'network' | 'nopack';

/** Sends a lead's answer to the server, like every puzzle. */
async function checkLead(slug: string, leadId: string, answer: string, variant: string | null): Promise<Status | 'correct'> {
  const res = await checkAnswer(slug, { chapterId: `lead:${leadId}`, answer, variant });
  if (res.status === 'slow') return 'slow';
  if (res.status === 'failed') return res.noPack ? 'nopack' : 'network';
  return res.correct ? 'correct' : 'wrong';
}

/**
 * The leads tab of the case journal: side investigations that open with the story. Not needed to finish,
 * but each one reveals more, and the detective report counts them.
 */
export function LeadsPanel({
  a,
  p,
  locale,
  t,
  dispatch,
  onNotice,
}: {
  a: Adventure;
  p: Progress;
  locale: Locale;
  t: Dictionary['game'];
  dispatch: (action: Action) => void;
  onNotice: (text: string) => void;
}) {
  const leads = visibleLeads(a, p);
  const [active, setActive] = useState<string | null>(null);
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => {
    top.current?.closest('[role="tabpanel"]')?.scrollTo({ top: 0 });
  }, [active]);
  const current = leads.find((l) => l.id === active && !p.leadsSolved.includes(l.id));
  if (current) {
    return (
      <div ref={top}>
        <LeadView key={current.id} a={a} p={p} lead={current} locale={locale} t={t} dispatch={dispatch} onNotice={onNotice} onBack={() => setActive(null)} />
      </div>
    );
  }
  const open = leads.filter((l) => !p.leadsSolved.includes(l.id));
  const solved = leads.filter((l) => p.leadsSolved.includes(l.id));
  return (
    <div ref={top} className="space-y-6">
      <p className="text-sm text-ivory-dim">{t.leads.intro}</p>
      {leads.length === 0 && <p className="rounded-2xl border border-dashed border-white/15 p-4 text-sm text-ivory-mute">{t.leads.empty}</p>}
      {open.length > 0 && (
        <section aria-labelledby="leads-open">
          <h3 id="leads-open" className="eyebrow">
            {t.leads.open}
          </h3>
          <ul className="mt-3 grid gap-3">
            {open.map((l) => (
              <li key={l.id}>
                <button type="button" onClick={() => setActive(l.id)} className="flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-gold/40 bg-gold/[0.06] p-4 text-start hover:border-gold">
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-gold">{t.leads.kinds[l.kind]}</span>
                    <span className="mt-0.5 block text-ivory">{l.title[locale]}</span>
                  </span>
                  <span className="text-gold rtl:rotate-180" aria-hidden="true">
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {p.secrets.length > 0 && (
        <section aria-labelledby="secrets-found">
          <h3 id="secrets-found" className="eyebrow">
            {t.report.secrets}
          </h3>
          <ul className="mt-3 space-y-3">
            {(a.secrets ?? [])
              .filter((s) => p.secrets.includes(s.id))
              .map((s) => (
                <li key={s.id} className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-4">
                  <p className="text-xs font-semibold text-gold">✦ {s.title[locale]}</p>
                  <p className="mt-1 text-sm text-ivory">{s.text[locale]}</p>
                </li>
              ))}
          </ul>
        </section>
      )}
      {solved.length > 0 && (
        <section aria-labelledby="leads-solved">
          <h3 id="leads-solved" className="eyebrow">
            {t.leads.solved}
          </h3>
          <ul className="mt-3 space-y-3">
            {solved.map((l) => (
              <li key={l.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-ivory-mute">{l.title[locale]}</p>
                <p className="mt-2 flex gap-2 text-ivory">
                  <span className="text-gold" aria-hidden="true">
                    ✓
                  </span>
                  {l.outcome[locale]}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function LeadView({
  a,
  p,
  lead,
  locale,
  t,
  dispatch,
  onNotice,
  onBack,
}: {
  a: Adventure;
  p: Progress;
  lead: Lead;
  locale: Locale;
  t: Dictionary['game'];
  dispatch: (action: Action) => void;
  onNotice: (text: string) => void;
  onBack: () => void;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [hints, setHints] = useState(0);
  const [text, setText] = useState('');
  const [picked, setPicked] = useState<{ doc: string; row: number } | null>(null);
  const [order, setOrder] = useState(() => (lead.events ?? []).map((e) => e.id));
  const docs = (lead.documents ?? []).map((id) => a.documents?.find((d) => d.id === id)).filter((d): d is NonNullable<typeof d> => !!d);
  const person = lead.person ? a.people.find((x) => x.id === lead.person) : undefined;

  async function submit(answer: string) {
    setStatus('checking');
    const r = await checkLead(a.slug, lead.id, answer, p.variant);
    if (r === 'correct') {
      sfx('correct');
      dispatch({ type: 'lead', leadId: lead.id });
      onNotice(lead.outcome[locale]);
      onBack();
    } else {
      if (r === 'wrong') sfx('wrong');
      setStatus(r);
    }
  }
  const discover = (id: string) => {
    dispatch({ type: 'discover', secretId: id });
    sfx('item');
    const secret = a.secrets?.find((s) => s.id === id);
    if (secret) onNotice(fmt(t.phone.secretFound, { name: secret.title[locale] }));
  };

  const message = status === 'wrong' ? t.incorrect : status === 'slow' ? t.tooFast : status === 'network' ? t.networkError : status === 'nopack' ? t.offline.noPack : null;

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="text-sm font-semibold text-gold hover:underline">
        <span className="inline-block rtl:rotate-180" aria-hidden="true">
          ←
        </span>{' '}
        {t.phone.back}
      </button>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gold">{t.leads.kinds[lead.kind]}</p>
        <p className="mt-1 font-display text-2xl leading-snug text-ivory">{lead.title[locale]}</p>
        <p className="mt-2 text-sm text-ivory-dim">{lead.brief[locale]}</p>
      </div>

      {lead.kind === 'confront' && (
        <>
          {person && lead.claim && (
            <blockquote className="rounded-2xl border-s-4 border-gold bg-gold/[0.06] p-4">
              <p className="text-xs font-semibold text-gold">{fmt(t.leads.says, { name: person.name[locale] })}</p>
              <p className="mt-1 font-display text-lg italic text-ivory">“{lead.claim[locale]}”</p>
            </blockquote>
          )}
          <p className="text-sm text-ivory-dim">{t.leads.pickRow}</p>
          <div className="space-y-4">
            {docs.map((d) => (
              <CaseDocumentView
                key={d.id}
                doc={d}
                locale={locale}
                t={t}
                pickedRow={picked?.doc === d.id ? picked.row : null}
                onPickRow={(row) => {
                  setStatus('idle');
                  setPicked({ doc: d.id, row });
                }}
                found={p.secrets}
                onSecret={discover}
              />
            ))}
          </div>
          <Footer message={message}>
            <button type="button" className="btn-gold w-full" disabled={!picked || status === 'checking'} onClick={() => picked && submit(confrontAnswer(picked.doc, picked.row))}>
              {status === 'checking' ? t.checking : t.leads.confront}
            </button>
          </Footer>
        </>
      )}

      {lead.kind === 'timeline' && (
        <>
          <div className="space-y-2">
            {docs.map((d) => (
              <details key={d.id} className="rounded-xl border border-white/10 p-3">
                <summary className="cursor-pointer text-sm text-gold">📄 {d.title[locale]}</summary>
                <div className="mt-3">
                  <CaseDocumentView doc={d} locale={locale} t={t} found={p.secrets} onSecret={discover} />
                </div>
              </details>
            ))}
          </div>
          <p className="text-sm text-ivory-dim">{t.leads.order}</p>
          <OrderStrips
            pieces={lead.events ?? []}
            order={order}
            onChange={(o) => {
              setStatus('idle');
              setOrder(o);
            }}
            locale={locale}
            labels={{ up: t.puzzles.up, down: t.puzzles.down, strip: t.puzzles.strip }}
          />
          <Footer message={message}>
            <button type="button" className="btn-gold w-full" disabled={status === 'checking'} onClick={() => submit(timelineAnswer(order))}>
              {status === 'checking' ? t.checking : t.leads.checkOrder}
            </button>
          </Footer>
        </>
      )}

      {(lead.kind === 'echo' || lead.kind === 'listen') && (
        <>
          {lead.kind === 'echo' && lead.echo && <EchoVision echo={lead.echo} t={t} found={p.secrets} onSecret={discover} />}
          {lead.kind === 'listen' && <Recording lead={lead} locale={locale} t={t} />}
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) void submit(text);
            }}
          >
            <label className="grid gap-1.5 text-sm">
              {t.answer}
              <input
                className="field"
                value={text}
                onChange={(e) => {
                  setStatus('idle');
                  setText(e.target.value);
                }}
                inputMode={lead.input === 'numeric' ? 'numeric' : 'text'}
                autoComplete="off"
                dir="auto"
              />
            </label>
            <Footer message={message}>
              <button type="submit" className="btn-gold w-full" disabled={status === 'checking'}>
                {status === 'checking' ? t.checking : t.submit}
              </button>
            </Footer>
          </form>
        </>
      )}

      <div className="space-y-2">
        {lead.hints.slice(0, hints).map((h, i) => (
          <p key={i} className="rounded-xl border border-gold/25 bg-gold/[0.06] p-3 text-sm text-ivory">
            {h[locale]}
          </p>
        ))}
        {hints < lead.hints.length && (
          <button type="button" className="btn-ghost" onClick={() => setHints((n) => n + 1)}>
            {hints ? t.nextHint : t.hint}
          </button>
        )}
      </div>
    </div>
  );
}

function Footer({ message, children }: { message: string | null; children: React.ReactNode }) {
  return (
    <div>
      {message && (
        <p role="status" className="mb-2 text-sm text-danger">
          {message}
        </p>
      )}
      {children}
    </div>
  );
}

/** A voice recording in the characters' acted voices; one line is spoken softly under the rest. */
function Recording({ lead, locale, t }: { lead: Lead; locale: Locale; t: Dictionary['game'] }) {
  const [played, setPlayed] = useState(false);
  useEffect(() => () => stopSpeaking(), []);
  const play = () => {
    stopSpeaking();
    sfx('page');
    (lead.recording ?? []).forEach((line, i) => speak(line.text[locale], locale, line.voice, i > 0, line.quiet ? 0.25 : 1));
    setPlayed(true);
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#101826] p-4">
      <button type="button" className="btn-gold min-h-[48px] shrink-0" onClick={play}>
        ▶ {played ? t.leads.again : t.leads.play}
      </button>
      <span className="flex h-8 flex-1 items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 32 }, (_, i) => (
          <i key={i} className="w-1 rounded-full bg-gold/50" style={{ height: `${20 + ((i * 37) % 70)}%` }} />
        ))}
      </span>
    </div>
  );
}

/**
 * The imagined view: the place as it is today, and as the author imagines it, under one slider. The
 * difference holds the clue. A hidden spot in the imagined view can give away a secret.
 */
function EchoVision({ echo, t, found, onSecret }: { echo: NonNullable<Lead['echo']>; t: Dictionary['game']; found: string[]; onSecret: (id: string) => void }) {
  const [split, setSplit] = useState(50);
  const secret = echo.secret && !found.includes(echo.secret.id) ? echo.secret : null;
  return (
    <figure className="space-y-2" dir="ltr">
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <FacadeSvg facade={echo.now} id="now" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
          <FacadeSvg facade={echo.imagined} id="imagined" sepia />
          {secret && split < secret.x && (
            <button
              type="button"
              onClick={() => onSecret(secret.id)}
              className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 text-xs ring-1 ring-gold/60 animate-shimmer"
              style={{ left: `${secret.x}%`, top: `${secret.y}%` }}
              aria-label={t.phone.lookCloser}
            >
              ✦
            </button>
          )}
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold shadow-[0_0_12px_rgba(221,182,106,.9)]" style={{ left: `${split}%` }} aria-hidden="true" />
        <span className="absolute start-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[11px] text-ivory">{t.leads.now}</span>
        <span className="absolute end-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[11px] text-gold">{t.leads.imagined}</span>
      </div>
      <label className="block text-xs text-ivory-mute">
        <span className="sr-only">{t.leads.compare}</span>
        <input type="range" min={0} max={100} value={split} onChange={(e) => setSplit(Number(e.target.value))} className="w-full accent-[#DDB66A]" aria-label={t.leads.compare} />
      </label>
      <figcaption className="text-center text-xs text-ivory-mute">{t.leads.compare}</figcaption>
    </figure>
  );
}

const TONE: Record<Facade['tone'], [string, string]> = {
  stone: ['#8b8478', '#6f695f'],
  brick: ['#8a4b3a', '#6d3a2d'],
  plaster: ['#c9b99a', '#a8987a'],
};

/**
 * A façade drawn from data: floors and bays of windows, a door, a roof, and marks (an extra window, a
 * carved symbol, a lamp, a hanging sign, a statue in a niche). A photo of a public place can replace it.
 */
export function FacadeSvg({ facade, id, sepia = false }: { facade: Facade; id: string; sepia?: boolean }) {
  if (facade.src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={facade.src} alt="" className={`block aspect-[5/6] w-full object-cover ${sepia ? 'sepia' : ''}`} />;
  }
  const W = 300;
  const H = 360;
  const [wall, shade] = TONE[facade.tone];
  const top = facade.roof === 'tower' ? 70 : 90;
  const floorH = (H - top - 40) / (facade.floors + 1);
  const bayW = (W - 60) / facade.bays;
  const windows = [];
  for (let f = 0; f < facade.floors; f++) {
    for (let b = 0; b < facade.bays; b++) {
      const x = 30 + b * bayW + bayW * 0.25;
      const y = top + 14 + f * floorH;
      const lit = (f * 3 + b * 5) % 4 === 0;
      windows.push(<rect key={`${f}-${b}`} x={x} y={y} width={bayW * 0.5} height={floorH * 0.6} rx={facade.door === 'arch' ? 6 : 1} fill={lit ? '#f2c66d' : '#1b2335'} stroke="#2a2a2a" strokeWidth={2} />);
    }
  }
  const doorW = 56;
  const doorX = W / 2 - doorW / 2;
  const doorTop = H - 40 - floorH * 0.95;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`block w-full ${sepia ? 'sepia-[.55]' : ''}`} role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sepia ? '#3d2f22' : '#0b1324'} />
          <stop offset="1" stopColor={sepia ? '#7a5a3a' : '#273c5e'} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      {facade.roof === 'gable' && <polygon points={`20,${top} ${W / 2},${top - 70} ${W - 20},${top}`} fill={shade} />}
      {facade.roof === 'tower' && <rect x={W / 2 - 40} y={top - 60} width={80} height={60} fill={shade} />}
      <rect x={20} y={top} width={W - 40} height={H - top - 40} fill={wall} />
      <rect x={20} y={top} width={W - 40} height={8} fill={shade} />
      {windows}
      {facade.door === 'arch' ? (
        <path d={`M${doorX},${H - 40} V${doorTop + doorW / 2} A${doorW / 2},${doorW / 2} 0 0 1 ${doorX + doorW},${doorTop + doorW / 2} V${H - 40} Z`} fill="#3b2a1d" stroke="#1d140d" strokeWidth={3} />
      ) : (
        <rect x={doorX} y={doorTop} width={doorW} height={H - 40 - doorTop} fill="#3b2a1d" stroke="#1d140d" strokeWidth={3} />
      )}
      <rect y={H - 40} width={W} height={40} fill="#2b2a2a" />
      {facade.marks.map((m, i) => {
        const x = (m.x / 100) * W;
        const y = (m.y / 100) * H;
        if (m.kind === 'window') return <rect key={i} x={x - 14} y={y - 18} width={28} height={36} rx={4} fill="#f2c66d" stroke="#2a2a2a" strokeWidth={2} />;
        if (m.kind === 'lamp')
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={14} fill="#f2c66d" opacity={0.35} />
              <circle cx={x} cy={y} r={6} fill="#ffe2a0" />
            </g>
          );
        if (m.kind === 'sign')
          return (
            <g key={i}>
              <line x1={x} y1={y - 22} x2={x} y2={y - 12} stroke="#1d140d" strokeWidth={2} />
              <rect x={x - 34} y={y - 12} width={68} height={26} rx={3} fill="#3b2a1d" stroke="#ddb66a" />
              <text x={x} y={y + 6} textAnchor="middle" fontSize={13} fontFamily="serif" fill="#ddb66a">
                {m.text}
              </text>
            </g>
          );
        if (m.kind === 'statue')
          return (
            <g key={i} fill="#d8d0c0">
              <rect x={x - 16} y={y - 30} width={32} height={46} rx={14} fill="#00000044" />
              <circle cx={x} cy={y - 18} r={6} />
              <rect x={x - 7} y={y - 12} width={14} height={24} rx={5} />
            </g>
          );
        return (
          <text key={i} x={x} y={y} textAnchor="middle" fontSize={22} fontFamily="serif" fontWeight={700} fill="#f1dfb0" stroke="#3b2a1d" strokeWidth={0.6}>
            {m.text}
          </text>
        );
      })}
    </svg>
  );
}
