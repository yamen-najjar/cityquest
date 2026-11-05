'use client';

import { useState } from 'react';
import type { Adventure } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { isLost, type Progress } from '@/lib/engine/progress';

/**
 * The detective report: what the team worked out, followed up and found, the decisions it made, and what
 * is still open. Open questions are named, open secrets only counted, so a replay still has surprises.
 */
export function DetectiveReport({ a, p, locale, t }: { a: Adventure; p: Progress; locale: Locale; t: Dictionary['game'] }) {
  const board = a.board ?? [];
  const leads = a.leads ?? [];
  const secrets = a.secrets ?? [];
  const r = t.report;
  const rows: [string, number, number][] = [
    [r.deductions, board.filter((q) => p.deductions.includes(q.id)).length, board.length],
    [r.leads, leads.filter((l) => p.leadsSolved.includes(l.id)).length, leads.length],
    [r.secrets, secrets.filter((s) => p.secrets.includes(s.id)).length, secrets.length],
  ];
  const decisions = a.chapters.flatMap((c) => {
    const picked = c.choice?.options.find((o) => o.id === p.choices[c.id]);
    return c.choice && picked ? [{ prompt: c.choice.prompt[locale], label: picked.label[locale] }] : [];
  });
  const missed = [
    ...board.filter((q) => !p.deductions.includes(q.id)).map((q) => q.question[locale]),
    ...leads.filter((l) => !p.leadsSolved.includes(l.id)).map((l) => l.title[locale]),
  ];
  const secretsLeft = secrets.length - rows[2]![1];

  return (
    <section className="mt-10 rounded-3xl border border-gold/30 bg-[#11161f] p-6" aria-labelledby="report-title">
      <h2 id="report-title" className="font-display text-3xl text-gold">
        {r.title}
      </h2>
      <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
        {rows.map(([k, got, total]) => (
          <div key={k} className="rounded-2xl border border-white/10 p-3">
            <dt className="text-xs text-ivory-mute">{k}</dt>
            <dd className="mt-1 font-display text-2xl tabular-nums text-gold">
              {got}/{total}
            </dd>
          </div>
        ))}
      </dl>
      {decisions.length > 0 && (
        <div className="mt-6">
          <h3 className="eyebrow">{r.decisions}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {decisions.map((d) => (
              <li key={d.prompt}>
                <span className="text-ivory-mute">{d.prompt} </span>
                <span className="text-ivory">→ {d.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6">
        <h3 className="eyebrow">{r.missed}</h3>
        {missed.length || secretsLeft ? (
          <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-ivory-dim">
            {missed.map((m) => (
              <li key={m}>{m}</li>
            ))}
            {secretsLeft > 0 && (
              <li>
                {r.secrets}: {secretsLeft} ✦
              </li>
            )}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ivory">{r.none}</p>
        )}
      </div>
    </section>
  );
}

/** Draws the souvenir card: the case, the team, the rank and the date, on the game's night-and-gold look. */
function drawCard(lines: { title: string; city: string; team: string; rank: string; stars: string; date: string; verdict: string }, rtl: boolean): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 1080;
  c.height = 1350;
  const g = c.getContext('2d')!;
  const bg = g.createLinearGradient(0, 0, 0, c.height);
  bg.addColorStop(0, '#060b16');
  bg.addColorStop(1, '#1c2e4a');
  g.fillStyle = bg;
  g.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 70; i++) {
    g.fillStyle = `rgba(248,244,236,${0.15 + ((i * 37) % 50) / 100})`;
    g.fillRect((i * 263) % 1080, (i * 151) % 700, 3, 3);
  }
  g.strokeStyle = '#ddb66a';
  g.lineWidth = 6;
  g.strokeRect(50, 50, c.width - 100, c.height - 100);
  g.direction = rtl ? 'rtl' : 'ltr';
  g.textAlign = 'center';
  const text = (s: string, y: number, size: number, color: string, font = 'serif') => {
    g.fillStyle = color;
    g.font = `${size}px ${font}`;
    g.fillText(s, c.width / 2, y, c.width - 180);
  };
  text('CITYQUEST', 190, 44, '#ddb66a', 'sans-serif');
  text(lines.verdict, 330, 54, '#f8f4ec');
  text(lines.title, 470, 84, '#ddb66a');
  text(lines.city, 560, 44, '#c9c2b4');
  g.fillStyle = '#ddb66a';
  g.fillRect(c.width / 2 - 120, 640, 240, 3);
  text(lines.team, 760, 56, '#f8f4ec');
  text(lines.rank, 860, 64, '#ddb66a');
  text(lines.stars, 950, 48, '#f8f4ec');
  text(lines.date, 1180, 36, '#9aa3b2', 'sans-serif');
  return c;
}

export function SouvenirCard({ a, p, locale, t, team, rank, stars, cityName }: { a: Adventure; p: Progress; locale: Locale; t: Dictionary['game']; team: string; rank: string; stars: number; cityName: string }) {
  const [busy, setBusy] = useState(false);
  const make = () =>
    drawCard(
      {
        title: a.title[locale],
        city: cityName,
        team,
        rank,
        stars: `${stars} ★`,
        date: p.finishedAt ? new Date(p.finishedAt).toLocaleDateString(locale === 'ar' ? 'ar-u-nu-latn' : locale) : '',
        verdict: isLost(p) ? t.danger.lost : t.resultsTitle,
      },
      locale === 'ar',
    );
  const file = async () => {
    const blob = await new Promise<Blob | null>((res) => make().toBlob(res, 'image/png'));
    return blob ? new File([blob], `cityquest-${a.slug}.png`, { type: 'image/png' }) : null;
  };
  const share = async () => {
    setBusy(true);
    try {
      const f = await file();
      if (f && navigator.canShare?.({ files: [f] })) await navigator.share({ files: [f], title: a.title[locale] });
      else if (f) download(f);
    } catch {
      /* the share sheet was closed */
    } finally {
      setBusy(false);
    }
  };
  const download = (f: File) => {
    const url = URL.createObjectURL(f);
    const link = document.createElement('a');
    link.href = url;
    link.download = f.name;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section className="mt-10 rounded-3xl border border-white/10 p-6 text-center" aria-labelledby="card-title">
      <h2 id="card-title" className="eyebrow">
        {t.report.card}
      </h2>
      <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" className="btn-gold" disabled={busy} onClick={share}>
          {t.report.share}
        </button>
        <button
          type="button"
          className="btn-ghost"
          disabled={busy}
          onClick={async () => {
            const f = await file();
            if (f) download(f);
          }}
        >
          {t.report.save}
        </button>
      </div>
    </section>
  );
}
