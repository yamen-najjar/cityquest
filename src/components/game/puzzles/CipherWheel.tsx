'use client';

import { useRef } from 'react';
import type { Locale } from '@/i18n/config';
import { sfx } from '@/lib/audio';

export const ALPHABETS: Record<Locale, string[]> = {
  de: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
  en: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
  nl: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
  ar: [...'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'],
};

/** Shifts every letter of the alphabet forward by `shift`; anything else is kept. Used to write the puzzles. */
export function caesar(text: string, shift: number, alphabet: string[]): string {
  const n = alphabet.length;
  return [...text].map((ch) => {
    const i = alphabet.indexOf(ch);
    return i < 0 ? ch : alphabet[(((i + shift) % n) + n) % n]!;
  }).join('');
}

/**
 * A cipher wheel: the outer ring is the plain alphabet, the inner ring the code alphabet. Turning the
 * inner ring changes the shift; the message underneath is read with the current setting, so the right
 * shift turns gibberish into words. Turn with the buttons, arrow keys or by dragging the wheel.
 */
export function CipherWheel({
  locale,
  shift,
  onShift,
  lines,
  labels,
}: {
  locale: Locale;
  shift: number;
  onShift: (s: number) => void;
  lines: string[];
  labels: { left: string; right: string; reads: string; setting: string };
}) {
  const alphabet = ALPHABETS[locale];
  const n = alphabet.length;
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ angle: number; shift: number } | null>(null);
  const set = (s: number) => {
    const v = ((s % n) + n) % n;
    if (v !== shift) sfx('page');
    onShift(v);
  };
  const angleOf = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
  };
  const step = 360 / n;
  const decoded = lines.map((l) => caesar(l, -shift, alphabet));

  return (
    <div className="rounded-2xl border border-gold/25 bg-navy p-4">
      <div className="space-y-1 text-center" dir="auto">
        {lines.map((l) => (
          <p key={l} className="font-mono text-lg tracking-widest text-ivory-dim">
            {l}
          </p>
        ))}
      </div>
      <svg
        ref={svgRef}
        viewBox="-110 -110 220 220"
        className="mx-auto my-3 block h-auto w-full max-w-[280px] touch-none select-none"
        role="slider"
        tabIndex={0}
        aria-label={labels.setting}
        aria-valuemin={0}
        aria-valuemax={n - 1}
        aria-valuenow={shift}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') set(shift - 1);
          else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') set(shift + 1);
          else return;
          e.preventDefault();
        }}
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          drag.current = { angle: angleOf(e), shift };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const delta = ((angleOf(e) - drag.current.angle) * 180) / Math.PI;
          set(drag.current.shift - Math.round(delta / step));
        }}
        onPointerUp={() => (drag.current = null)}
      >
        <circle r="106" fill="#142238" stroke="#DDB66A" strokeWidth="1.5" />
        <circle r="78" fill="#0B1324" stroke="#DDB66A" strokeOpacity=".5" />
        {alphabet.map((ch, i) => {
          const a = ((i * step - 90) * Math.PI) / 180;
          return (
            <text key={`o${i}`} x={Math.cos(a) * 92} y={Math.sin(a) * 92 + 4} textAnchor="middle" fontSize="11" fill="#F8F4EC" fontWeight="600">
              {ch}
            </text>
          );
        })}
        <g style={{ transform: `rotate(${-shift * step}deg)`, transition: 'transform .25s ease-out' }}>
          {alphabet.map((ch, i) => {
            const a = ((i * step - 90) * Math.PI) / 180;
            return (
              <text key={`i${i}`} x={Math.cos(a) * 64} y={Math.sin(a) * 64 + 4} textAnchor="middle" fontSize="10.5" fill="#DDB66A" fontWeight="700" transform={`rotate(${i * step} ${Math.cos(a) * 64} ${Math.sin(a) * 64})`}>
                {ch}
              </text>
            );
          })}
        </g>
        <circle r="30" fill="#142238" stroke="#DDB66A" strokeOpacity=".6" />
        <text y="7" textAnchor="middle" fontSize="20" fill="#DDB66A" fontWeight="700">
          {shift}
        </text>
        <path d="M0 -108 L-5 -118 L5 -118 Z" fill="#DDB66A" />
      </svg>
      <div className="flex items-center justify-center gap-3">
        <button type="button" className="btn-ghost min-h-[40px] px-4 py-1" onClick={() => set(shift - 1)} aria-label={labels.left}>
          ◀
        </button>
        <span className="text-xs text-ivory-mute">{labels.setting}: {shift}</span>
        <button type="button" className="btn-ghost min-h-[40px] px-4 py-1" onClick={() => set(shift + 1)} aria-label={labels.right}>
          ▶
        </button>
      </div>
      <div className="mt-3 rounded-xl bg-white/5 p-3 text-center" aria-live="polite">
        <p className="text-xs text-ivory-mute">{labels.reads}</p>
        {decoded.map((l, i) => (
          <p key={i} className="font-mono text-lg tracking-widest text-gold" dir="auto">
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}
