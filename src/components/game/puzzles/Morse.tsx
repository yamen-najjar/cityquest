'use client';

import { useEffect, useRef, useState } from 'react';
import { playMorse } from '@/lib/audio';

export const MORSE_DIGITS: Record<string, string> = {
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  '0': '-----',
};

/**
 * A lantern across the water flashing a signal, with matching beeps. The code book of digits is open
 * beside it; telling short from long flashes is the puzzle.
 */
export function Morse({ code, labels }: { code: string; labels: { play: string; again: string; book: string; playing: string } }) {
  const [on, setOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const play = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setPlaying(true);
    const length = playMorse(code, 0.22, (state, at) => {
      timers.current.push(window.setTimeout(() => setOn(state), at * 1000 + 50));
    });
    timers.current.push(window.setTimeout(() => setPlaying(false), length * 1000 + 300));
  };

  return (
    <div className="grid gap-4 rounded-2xl border border-gold/25 bg-navy p-4 sm:grid-cols-[1fr_auto]">
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-black/60 p-6">
        <svg viewBox="0 0 60 90" className="h-28 w-auto" aria-hidden="true">
          <defs>
            <radialGradient id="lamp-glow">
              <stop offset="0" stopColor="#FFE2A8" stopOpacity="1" />
              <stop offset="1" stopColor="#FFB45C" stopOpacity="0" />
            </radialGradient>
          </defs>
          {on && <circle cx="30" cy="48" r="30" fill="url(#lamp-glow)" />}
          <path d="M22 18 h16 l4 8 h-24 Z" fill="#2b2b2b" />
          <rect x="20" y="26" width="20" height="36" rx="3" fill={on ? '#FFE2A8' : '#2a2a30'} stroke="#555" />
          <rect x="18" y="62" width="24" height="6" rx="2" fill="#2b2b2b" />
          <circle cx="30" cy="13" r="5" fill="none" stroke="#555" strokeWidth="2" />
        </svg>
        <button type="button" className="btn-gold" onClick={play} disabled={playing}>
          {playing ? labels.playing : on ? labels.again : labels.play}
        </button>
      </div>
      <div>
        <p className="text-xs font-semibold text-gold">{labels.book}</p>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-sm" dir="ltr">
          {Object.entries(MORSE_DIGITS).map(([d, m]) => (
            <div key={d} className="flex gap-2">
              <dt className="text-gold">{d}</dt>
              <dd className="tracking-widest text-ivory-dim">{m.replace(/\./g, '•').replace(/-/g, '—')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
