'use client';

import { useRef, useState } from 'react';
import { useModal } from '@/lib/use-modal';
import type { Adventure } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { fmt } from '@/i18n/fmt';
import { sfx } from '@/lib/audio';
import type { Progress } from '@/lib/engine/progress';

/**
 * The pursuer's danger around the edges of the screen: a red glow that pulses faster and stronger as he
 * comes closer. Slow by design (one pulse every 1–3 seconds), never a flash. Screen readers hear the level.
 */
export function DangerPulse({ level, levels, label }: { level: number; levels: number; label: string }) {
  if (level < 1) return null;
  const strength = Math.min(1, level / Math.max(1, levels - 1));
  const seconds = level >= levels - 1 ? 1.1 : level >= 2 ? 1.8 : 2.8;
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 animate-danger"
        style={{
          animationDuration: `${seconds}s`,
          boxShadow: `inset 0 0 ${50 + 90 * strength}px ${8 + 22 * strength}px rgba(220, 38, 38, ${0.22 + 0.48 * strength})`,
        }}
      />
      <p className="sr-only" role="status">
        {label}
      </p>
    </>
  );
}

/**
 * The first catch: the pursuer took something, and a short puzzle wins it back. Blocks the game until
 * then, because the stolen item may be needed further on. The answer is checked on the server ("recover").
 */
export function CaughtDialog({
  a,
  p,
  locale,
  t,
  onRecovered,
}: {
  a: Adventure;
  p: Progress;
  locale: Locale;
  t: Dictionary['game'];
  onRecovered: (message: string) => void;
}) {
  const pursuit = a.pursuit!;
  const caught = pursuit.caught!;
  const item = p.seized ? a.items.find((i) => i.id === p.seized) : undefined;
  const [answer, setAnswer] = useState('');
  const [hints, setHints] = useState(0);
  const [status, setStatus] = useState<'idle' | 'checking' | 'wrong' | 'slow' | 'network'>('idle');
  const name = pursuit.name[locale];
  const dialogRef = useRef<HTMLElement>(null);
  // Must be answered: it keeps focus inside, but Escape does not dismiss it.
  useModal(dialogRef);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;
    setStatus('checking');
    try {
      const res = await fetch(`/api/game/${a.slug}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: 'recover', answer, variant: p.variant ?? undefined }),
      });
      if (res.status === 429) return setStatus('slow');
      if (!res.ok) throw new Error(String(res.status));
      const { correct } = (await res.json()) as { correct: boolean };
      if (correct) {
        sfx('item');
        onRecovered(`${caught.recover.success[locale]} ${fmt(t.danger.recovered, { name })}`);
      } else {
        sfx('wrong');
        setStatus('wrong');
      }
    } catch {
      setStatus('network');
    }
  }

  const message = status === 'wrong' ? t.incorrect : status === 'slow' ? t.tooFast : status === 'network' ? t.networkError : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 sm:items-center sm:p-4">
      <section ref={dialogRef} tabIndex={-1} role="alertdialog" aria-modal="true" aria-labelledby="caught-title" className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-danger/50 bg-[#140b0b] p-6 shadow-card sm:rounded-3xl">
        <h2 id="caught-title" className="font-display text-4xl text-danger" tabIndex={-1} ref={(el) => el?.focus()}>
          {t.danger.caught}
        </h2>
        <p className="mt-4 font-display text-lg italic leading-relaxed text-ivory-dim">{caught.text[locale]}</p>
        {item && <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-ivory">{fmt(t.danger.took, { name, item: item.name[locale] })}</p>}

        {item ? (
          <form className="mt-6 grid gap-3" onSubmit={submit}>
            <p className="eyebrow">{t.danger.winBack}</p>
            <p className="text-ivory">{caught.recover.prompt[locale]}</p>
            {caught.recover.material && (
              <div className="rounded-2xl border border-gold/25 bg-navy p-4 text-center font-mono text-xl tracking-[0.18em] text-gold">
                {caught.recover.material[locale].map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            )}
            <label className="grid gap-1.5 text-sm">
              {t.answer}
              <input
                className="field"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setStatus('idle');
                }}
                inputMode={caught.recover.input === 'numeric' ? 'numeric' : 'text'}
                autoComplete="off"
                dir="auto"
              />
            </label>
            <p role="status" className="sr-only">
              {message}
            </p>
            {message && (
              <p aria-hidden="true" className="text-sm text-danger">
                {message}
              </p>
            )}
            <button type="submit" className="btn-gold" disabled={status === 'checking'}>
              {status === 'checking' ? t.checking : t.submit}
            </button>
            {/* Free hints here: the catch was the price already. */}
            <p role="status" className="sr-only">
              {hints > 0 ? caught.recover.hints[hints - 1]?.[locale] : ''}
            </p>
            {caught.recover.hints.slice(0, hints).map((h, i) => (
              <p key={i} className="rounded-xl border border-gold/25 bg-gold/[0.06] p-3 text-sm text-ivory">
                {h[locale]}
              </p>
            ))}
            {hints < caught.recover.hints.length && (
              <button type="button" className="btn-ghost" onClick={() => setHints((n) => n + 1)}>
                {hints ? t.nextHint : t.hint}
              </button>
            )}
          </form>
        ) : (
          <button type="button" className="btn-gold mt-6 w-full" onClick={() => onRecovered('')}>
            {t.danger.continue}
          </button>
        )}
      </section>
    </div>
  );
}
