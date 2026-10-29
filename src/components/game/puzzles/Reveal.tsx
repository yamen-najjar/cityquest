'use client';

import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/config';
import { prefersReducedMotion } from '../../three/support';

/**
 * A dark wall or page with writing that only shows under the light. Move a finger or the mouse over it
 * to shine the light; "Sweep the light" moves it across for you (keyboard, screen reader, tired arms).
 */
export function Reveal({
  lines,
  mirrored,
  locale,
  surface,
  labels,
}: {
  lines: string[];
  mirrored?: boolean;
  locale: Locale;
  surface: 'wall' | 'paper';
  labels: { touch: string; sweep: string };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const light = useRef<{ x: number; y: number } | null>(null);
  const draw = useRef<() => void>(() => {});
  const W = 800;
  const H = 440;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    // The surface, drawn once.
    const base = document.createElement('canvas');
    base.width = W;
    base.height = H;
    const b = base.getContext('2d')!;
    b.fillStyle = surface === 'wall' ? '#141a24' : '#2a2219';
    b.fillRect(0, 0, W, H);
    let seed = 9;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    if (surface === 'wall') {
      for (let y = 0; y < H; y += 44) {
        for (let x = (y / 44) % 2 ? -50 : 0; x < W; x += 100) {
          b.fillStyle = `rgba(255,255,255,${0.02 + rnd() * 0.03})`;
          b.fillRect(x + 3, y + 3, 94, 38);
        }
      }
    } else {
      for (let i = 0; i < 1400; i++) {
        b.fillStyle = `rgba(255,230,190,${rnd() * 0.04})`;
        b.fillRect(rnd() * W, rnd() * H, 3, 3);
      }
    }
    // The hidden ink, drawn once.
    const ink = document.createElement('canvas');
    ink.width = W;
    ink.height = H;
    const k = ink.getContext('2d')!;
    k.save();
    if (mirrored) {
      k.translate(W, 0);
      k.scale(-1, 1);
    }
    k.fillStyle = '#b9d4ff';
    k.shadowColor = '#7fb0ff';
    k.shadowBlur = 14;
    k.textAlign = 'center';
    k.textBaseline = 'middle';
    k.direction = locale === 'ar' ? 'rtl' : 'ltr';
    const size = lines.some((l) => l.length > 22) ? 40 : 54;
    k.font = `600 ${size}px ${locale === 'ar' ? 'Tahoma, sans-serif' : 'Georgia, serif'}`;
    lines.forEach((l, i) => k.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * size * 1.35));
    k.restore();

    draw.current = () => {
      ctx.drawImage(base, 0, 0);
      const p = light.current;
      if (!p) return;
      // The beam: a soft circle of light, and the ink only inside it.
      const g = ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, 130);
      g.addColorStop(0, 'rgba(160,190,255,0.35)');
      g.addColorStop(1, 'rgba(160,190,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 120, 0, Math.PI * 2);
      ctx.clip();
      ctx.globalAlpha = 0.95;
      ctx.drawImage(ink, 0, 0);
      ctx.restore();
    };
    draw.current();
  }, [lines, mirrored, locale, surface]);

  const at = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    light.current = { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
    draw.current();
  };

  const sweep = () => {
    const rows = Math.max(1, lines.length);
    const total = prefersReducedMotion() ? 1 : 5200;
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      const row = Math.min(rows - 1, Math.floor(t * rows));
      const within = (t * rows) % 1;
      const size = lines.some((l) => l.length > 22) ? 40 : 54;
      light.current = { x: 80 + within * (W - 160), y: H / 2 + (row - (rows - 1) / 2) * size * 1.35 };
      draw.current();
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  return (
    <div className="rounded-2xl border border-gold/25 bg-black p-2">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block w-full cursor-none touch-none rounded-xl"
        role="img"
        aria-label={labels.touch}
        onPointerDown={at}
        onPointerMove={at}
        onPointerLeave={() => {
          light.current = null;
          draw.current();
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-2">
        <p className="text-xs text-ivory-mute">{labels.touch}</p>
        <button type="button" className="btn-ghost min-h-[36px] px-4 py-1 text-xs" onClick={sweep}>
          {labels.sweep}
        </button>
      </div>
    </div>
  );
}
