'use client';

import { useEffect, useRef } from 'react';
import type { ModelSpec } from '@/content/types';
import { buildModel } from './models';
import { report3DFailure } from './support';
import { Viewer } from './viewer';

/**
 * One item or artifact in 3D. Drag (or the arrow keys) to turn it. The canvas carries the item's name
 * for screen readers; the item's text description is always shown next to it.
 */
export default function Artifact3D({
  spec,
  label,
  className = 'h-56 w-full',
  spin = 0.35,
  pitch = 0.35,
}: {
  spec: ModelSpec;
  label: string;
  className?: string;
  spin?: number;
  pitch?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const specKey = JSON.stringify(spec);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isRing = spec.kind === 'ring';
    let v: Viewer;
    try {
      v = new Viewer(canvas, {
        camera: isRing ? [0, 2.6, 4.2] : [0, 0.3, 4.6],
        target: [0, 0, 0],
        fov: 38,
        drag: { pitch: isRing ? [-0.2, 1.1] : [-0.8, 0.8] },
        idleSpin: spin,
        initialPitch: isRing ? 0.25 : pitch * 0.4,
        initialYaw: isRing ? 0.3 : -0.5,
      });
      v.root.add(buildModel(JSON.parse(specKey) as ModelSpec));
    } catch (err) {
      report3DFailure(err);
      return;
    }
    v.invalidate();
    viewerRef.current = v;
    return () => {
      v.dispose();
      viewerRef.current = null;
    };
  }, [specKey, spin, pitch, spec.kind]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      tabIndex={0}
      className={`${className} cursor-grab rounded-2xl active:cursor-grabbing`}
      onKeyDown={(e) => {
        const v = viewerRef.current;
        if (!v) return;
        const step = 0.25;
        if (e.key === 'ArrowLeft') v.rotateBy(-step, 0);
        else if (e.key === 'ArrowRight') v.rotateBy(step, 0);
        else if (e.key === 'ArrowUp') v.rotateBy(0, -step);
        else if (e.key === 'ArrowDown') v.rotateBy(0, step);
        else return;
        e.preventDefault();
      }}
    />
  );
}
