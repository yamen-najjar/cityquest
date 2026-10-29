'use client';

import type { Locale } from '@/i18n/config';
import { sfx } from '@/lib/audio';

/**
 * Torn strips of paper to put back in order. Each strip moves up or down with its arrows (buttons, so
 * keyboards and screen readers can do it too); the strip being moved flashes.
 */
export function OrderStrips({
  pieces,
  order,
  onChange,
  locale,
  labels,
}: {
  pieces: { id: string; text: Record<Locale, string> }[];
  order: string[];
  onChange: (order: string[]) => void;
  locale: Locale;
  labels: { up: string; down: string; strip: string };
}) {
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
    sfx('page');
  };
  return (
    <ol className="space-y-2">
      {order.map((id, i) => {
        const piece = pieces.find((p) => p.id === id);
        if (!piece) return null;
        const label = labels.strip.replace('{n}', String(i + 1));
        return (
          <li key={id} className="flex items-stretch gap-2 animate-rise">
            <p
              className="flex-1 bg-[#e9ddc3] px-4 py-3 font-display text-lg italic leading-snug text-[#2b2118] shadow-card"
              style={{ clipPath: 'polygon(0 6%, 4% 0, 12% 5%, 22% 0, 35% 6%, 48% 1%, 60% 5%, 73% 0, 86% 6%, 100% 2%, 99% 96%, 88% 100%, 75% 94%, 61% 100%, 47% 95%, 34% 100%, 20% 94%, 9% 100%, 0 95%)' }}
            >
              {piece.text[locale]}
            </p>
            <div className="flex flex-col gap-1">
              <button type="button" className="h-1/2 min-h-[36px] w-11 rounded-lg border border-white/15 hover:border-gold disabled:opacity-30" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`${labels.up}: ${label}`}>
                ▲
              </button>
              <button type="button" className="h-1/2 min-h-[36px] w-11 rounded-lg border border-white/15 hover:border-gold disabled:opacity-30" onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label={`${labels.down}: ${label}`}>
                ▼
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
