'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { approach, Viewer } from './viewer';
import { buildLock, dialAngle, type LockModel } from './models';
import { report3DFailure } from './support';

export interface LockLabels {
  dial: string; // "Dial {n}"
  up: string;
  down: string;
  hint: string;
}

/**
 * A padlock with turning dials. Swipe a dial up or down on the lock, or use the buttons and arrow keys
 * underneath, which are real spin buttons for keyboards and screen readers. `value` is the digits shown.
 */
export default function Lock3D({
  value,
  onChange,
  open,
  labels,
}: {
  value: string;
  onChange: (v: string) => void;
  open: boolean;
  labels: LockLabels;
}) {
  const digits = value.length;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const lockRef = useRef<LockModel | null>(null);
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  /** Each dial's total turn, kept unwrapped so a 9 -> 0 step turns forward instead of spinning back. */
  const turns = useRef<number[]>([]);
  const tokens = useRef<number[]>([]);

  // Build once per number of digits.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let v: Viewer;
    let lock: LockModel;
    try {
      v = new Viewer(canvas, {
        camera: [0, 0.35, 4.4 + digits * 0.35],
        target: [0, 0.15, 0],
        fov: 34,
        drag: { yaw: [-0.5, 0.5], pitch: [-0.25, 0.3] },
        initialYaw: -0.18,
        initialPitch: 0.08,
        touchAction: 'none',
      });
      lock = buildLock(digits);
    } catch (err) {
      report3DFailure(err);
      return;
    }
    v.root.add(lock.group);
    turns.current = [...valueRef.current].map((d) => dialAngle(Number(d) || 0));
    lock.dials.forEach((dial, i) => (dial.rotation.x = turns.current[i]!));

    // Swiping on a dial turns it; anywhere else turns the whole lock.
    const raycaster = new THREE.Raycaster();
    v.onPointerDown = (e, ndc) => {
      raycaster.setFromCamera(ndc, v.camera);
      const hit = raycaster.intersectObjects(lock.dials, true)[0];
      if (!hit) return false;
      let o: THREE.Object3D | null = hit.object;
      while (o && o.userData.index === undefined) o = o.parent;
      const index = o?.userData.index as number | undefined;
      if (index === undefined) return false;
      let lastY = e.clientY;
      const move = (ev: PointerEvent) => {
        const dy = ev.clientY - lastY;
        if (Math.abs(dy) < 24) return;
        lastY = ev.clientY;
        step(index, dy < 0 ? 1 : -1);
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      return true;
    };

    v.invalidate();
    viewerRef.current = v;
    lockRef.current = lock;
    return () => {
      v.dispose();
      viewerRef.current = null;
      lockRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  function step(i: number, dir: 1 | -1) {
    const cur = valueRef.current;
    const d = (Number(cur[i]) + dir + 10) % 10;
    onChangeRef.current(cur.slice(0, i) + d + cur.slice(i + 1));
  }

  function set(i: number, d: number) {
    const cur = valueRef.current;
    onChangeRef.current(cur.slice(0, i) + d + cur.slice(i + 1));
  }

  // Turn each dial to its digit, the short way round.
  useEffect(() => {
    const v = viewerRef.current;
    const lock = lockRef.current;
    if (!v || !lock) return;
    [...value].forEach((ch, i) => {
      const dial = lock.dials[i];
      if (!dial) return;
      const target = dialAngle(Number(ch) || 0);
      const cur = turns.current[i] ?? target;
      const tau = Math.PI * 2;
      let delta = (((target - cur) % tau) + tau) % tau;
      if (delta > Math.PI) delta -= tau;
      const goal = cur + delta;
      turns.current[i] = goal;
      // A newer turn of the same dial replaces any turn still running.
      const token = (tokens.current[i] = (tokens.current[i] ?? 0) + 1);
      const ease = approach(() => dial.rotation.x, (x) => (dial.rotation.x = x), goal, 14);
      v.addTween((dt) => tokens.current[i] === token && ease(dt));
    });
  }, [value]);

  // Open the shackle once the code is right.
  useEffect(() => {
    const v = viewerRef.current;
    const lock = lockRef.current;
    if (!v || !lock || !open) return;
    const s = lock.shackle;
    const baseY = s.position.y;
    v.addTween(approach(() => s.position.y - baseY, (y) => (s.position.y = baseY + y), 0.38, 8));
    v.addTween(approach(() => s.rotation.y, (r) => (s.rotation.y = r), -1.1, 5));
  }, [open]);

  return (
    <div className="rounded-2xl border border-gold/25 bg-navy p-3">
      <canvas ref={canvasRef} aria-hidden="true" className="h-56 w-full touch-none sm:h-64" />
      <p className="mt-1 text-center text-xs text-ivory-mute">{labels.hint}</p>
      <div className="mt-3 flex justify-center gap-2" dir="ltr">
        {[...value].map((ch, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <button type="button" className="flex h-9 w-12 items-center justify-center rounded-lg border border-white/15 hover:border-gold" onClick={() => step(i, 1)} aria-label={`${labels.up} (${labels.dial.replace('{n}', String(i + 1))})`} disabled={open}>
              ▲
            </button>
            <span
              role="spinbutton"
              tabIndex={0}
              aria-label={labels.dial.replace('{n}', String(i + 1))}
              aria-valuemin={0}
              aria-valuemax={9}
              aria-valuenow={Number(ch)}
              className="flex h-11 w-12 items-center justify-center rounded-lg bg-navy-800 font-mono text-2xl text-gold"
              onKeyDown={(e) => {
                if (open) return;
                if (e.key === 'ArrowUp') step(i, 1);
                else if (e.key === 'ArrowDown') step(i, -1);
                else if (/^[0-9]$/.test(e.key)) set(i, Number(e.key));
                else return;
                e.preventDefault();
              }}
            >
              {ch}
            </span>
            <button type="button" className="flex h-9 w-12 items-center justify-center rounded-lg border border-white/15 hover:border-gold" onClick={() => step(i, -1)} aria-label={`${labels.down} (${labels.dial.replace('{n}', String(i + 1))})`} disabled={open}>
              ▼
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
