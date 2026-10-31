import type { ReactNode } from 'react';

// Small presentational pieces shared by the admin pages, so every screen keeps the same header,
// tiles, cards and status pills.

export function AdminHeader({ eyebrow, title, intro, actions }: { eyebrow: string; title: string; intro?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/5 pb-4 pt-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</div>
        <h1 className="mt-1 font-display text-3xl font-semibold">{title}</h1>
        {intro && <p className="mt-1 text-sm text-ivory-mute">{intro}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Tile({ k, v, d, tone = 'muted' }: { k: string; v: ReactNode; d?: string; tone?: 'up' | 'muted' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-navy-800/90 to-navy-800/50 p-4">
      <div className="text-[0.74rem] uppercase tracking-[0.1em] text-ivory-mute">{k}</div>
      <div className="mt-1 font-display text-3xl tabular-nums">{v}</div>
      {d && <div className={`mt-1 text-[0.76rem] ${tone === 'up' ? 'text-success' : 'text-ivory-mute'}`}>{d}</div>}
    </div>
  );
}

export function Card({ title, intro, actions, children }: { title: string; intro?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[18px] border border-white/10 bg-navy-800/55">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-4">
        <div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          {intro && <p className="mt-0.5 text-[0.82rem] text-ivory-mute">{intro}</p>}
        </div>
        {actions}
      </header>
      <div className="px-2 pb-4 pt-1">{children}</div>
    </section>
  );
}

const TONES: Record<string, string> = {
  published: 'text-success bg-success/10 border-success/30',
  draft: 'text-gold-soft bg-gold/10 border-gold/30',
  off: 'text-ivory-mute bg-white/5 border-white/10',
  danger: 'text-danger bg-danger/10 border-danger/30',
};

export function Pill({ tone, children }: { tone: keyof typeof TONES | string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONES[tone] ?? TONES.off}`}>
      <span className="size-[7px] rounded-full bg-current" />
      {children}
    </span>
  );
}

/** Horizontally scrollable wrapper so wide tables never widen the page. */
export function TableScroll({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>;
}
