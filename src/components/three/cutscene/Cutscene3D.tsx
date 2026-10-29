'use client';

import { useEffect, useRef, useState } from 'react';
import type { Scene } from '@/content/types';
import type { Locale } from '@/i18n/config';
import { speak, stopSpeaking } from '@/lib/audio';
import { report3DFailure } from '../support';
import { Viewer } from '../viewer';
import { ScenePlayer } from './player';

export interface CutsceneLabels {
  play: string;
  replay: string;
  skip: string;
  loading: string;
}

/**
 * Plays a scene once in a letterboxed frame. It starts by itself, except with reduced motion, where it
 * shows the last frame and waits for Play. Skip jumps to the end; Replay starts again. The story text
 * under it tells the same moment, so nothing is lost for anyone who cannot see the animation.
 */
export default function Cutscene3D({
  scene,
  label,
  labels,
  locale,
  onEnd,
}: {
  scene: Scene;
  label: string;
  labels: CutsceneLabels;
  locale: Locale;
  onEnd?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const control = useRef<{ play: () => void; skip: () => void } | null>(null);
  const [status, setStatus] = useState<'loading' | 'playing' | 'ended'>('loading');
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;
  const sceneKey = JSON.stringify(scene);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let viewer: Viewer;
    try {
      viewer = new Viewer(canvas, { camera: [0, 1.6, 4], fov: 42, lights: false, environmentIntensity: 0.15, cinematic: true });
    } catch (err) {
      report3DFailure(err);
      return;
    }
    let disposed = false;
    let time = 0;
    let run = 0;
    setStatus('loading');
    ScenePlayer.create(JSON.parse(sceneKey) as Scene, viewer)
      .then((player) => {
        if (disposed) return;
        // Subtitles, and the same lines spoken in the device's voice (when sound and voices are on).
        const lines = (JSON.parse(sceneKey) as Scene).lines ?? [];
        let spoken = -1;
        const subtitle = (at: number) => {
          const i = lines.findIndex((l) => at >= l.t && at < l.t + l.d);
          const el = subRef.current;
          if (el) {
            el.textContent = i >= 0 ? lines[i]!.text[locale] : '';
            el.style.opacity = i >= 0 ? '1' : '0';
          }
          if (i >= 0 && i !== spoken) {
            spoken = i;
            speak(lines[i]!.text[locale], locale, lines[i]!.voice, true);
          }
        };
        const finish = () => {
          time = player.duration;
          subtitle(-1);
          player.apply(time);
          viewer.invalidate();
          setStatus('ended');
          onEndRef.current?.();
        };
        const play = () => {
          const id = ++run;
          time = 0;
          spoken = -1;
          setStatus('playing');
          viewer.addTween((dt) => {
            if (id !== run) return false;
            time = Math.min(player.duration, time + dt);
            player.apply(time);
            subtitle(time);
            if (time >= player.duration) {
              finish();
              return false;
            }
            return true;
          });
        };
        control.current = {
          play,
          skip: () => {
            run++;
            stopSpeaking();
            finish();
          },
        };
        if (viewer.reducedMotion) finish();
        else play();
      })
      .catch((err) => {
        if (!disposed) report3DFailure(err);
      });
    return () => {
      disposed = true;
      run++;
      control.current = null;
      stopSpeaking();
      viewer.dispose();
    };
  }, [sceneKey, locale]);

  return (
    <figure className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
      <canvas ref={canvasRef} role="img" aria-label={label} className="block aspect-[16/10] w-full sm:aspect-video" />
      {/* Letterbox bars */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[6%] bg-black" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[6%] bg-black" aria-hidden="true" />
      <p
        ref={subRef}
        aria-live="polite"
        className="pointer-events-none absolute inset-x-4 bottom-[9%] mx-auto w-fit max-w-[92%] rounded-lg bg-black/70 px-3 py-1.5 text-center text-sm text-ivory opacity-0 transition-opacity sm:text-base"
      />
      {status === 'loading' && (
        <p className="absolute inset-0 flex animate-pulse items-center justify-center text-sm text-ivory-dim" role="status">
          {labels.loading}
        </p>
      )}
      <div className="absolute bottom-3 end-3 flex gap-2">
        {status === 'loading' ? null : status === 'playing' ? (
          <button type="button" className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-ivory backdrop-blur hover:bg-black/80" onClick={() => control.current?.skip()}>
            {labels.skip} ⏭
          </button>
        ) : (
          <button type="button" className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-gold backdrop-blur hover:bg-black/80" onClick={() => control.current?.play()}>
            ↻ {labels.replay}
          </button>
        )}
      </div>
    </figure>
  );
}
