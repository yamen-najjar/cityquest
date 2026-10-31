'use client';
import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import type { Dictionary } from '@/i18n/dictionary';

type Status = 'starting' | 'scanning' | 'denied' | 'nocamera';
const MAX_SIDE = 640; // decode at most ~640px on the long side: enough for QR, far cheaper on phones.

/**
 * Scans the checkpoint's QR code with the camera. The camera is requested only when this mounts (the
 * player tapped "Scan"), the stream is stopped whenever scanning ends, and nothing leaves the device —
 * frames are decoded locally and only a match (or cancel) is reported. Manual confirmation is the fallback.
 */
export default function QrScanner({
  code,
  t,
  onMatch,
  onClose,
}: {
  code: string;
  t: Dictionary['game'];
  onMatch: () => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const matchedRef = useRef(false);
  const onMatchRef = useRef(onMatch);
  onMatchRef.current = onMatch;
  const [status, setStatus] = useState<Status>('starting');

  useEffect(() => {
    let cancelled = false;

    function stopStream() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    }

    function tick() {
      const video = videoRef.current;
      if (!video || matchedRef.current || cancelled) return;
      if (video.readyState >= video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
        const scale = Math.min(1, MAX_SIDE / Math.max(video.videoWidth, video.videoHeight));
        const w = Math.round(video.videoWidth * scale);
        const h = Math.round(video.videoHeight * scale);
        const canvas = (canvasRef.current ??= document.createElement('canvas'));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, w, h);
          const img = ctx.getImageData(0, 0, w, h);
          const result = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
          if (result && result.data.trim() === code) {
            matchedRef.current = true;
            stopStream();
            onMatchRef.current();
            return;
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    async function start() {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setStatus('nocamera');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        // If the OS reclaims or revokes the camera, don't sit on a frozen frame.
        stream.getVideoTracks()[0]?.addEventListener('ended', () => {
          if (!cancelled) {
            stopStream();
            setStatus('nocamera');
          }
        });
        const video = videoRef.current!;
        video.srcObject = stream;
        await video.play();
        setStatus('scanning');
        tick();
      } catch (err) {
        stopStream();
        setStatus((err as DOMException)?.name === 'NotAllowedError' ? 'denied' : 'nocamera');
      }
    }

    start();
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [code]);

  const message = status === 'denied' ? t.qrDenied : status === 'nocamera' ? t.qrNoCamera : t.qrPrompt;

  return (
    <div className="mt-5 space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
        <video ref={videoRef} className="block h-64 w-full object-cover" playsInline muted aria-label={t.qrPrompt} />
        {status === 'scanning' && (
          <div className="pointer-events-none absolute inset-0 m-auto size-40 rounded-xl border-2 border-gold/70" aria-hidden="true" />
        )}
      </div>
      <p role="status" className="text-sm text-ivory-dim">
        {message}
      </p>
      <button type="button" className="btn-ghost" onClick={onClose} autoFocus>
        {t.qrCancel}
      </button>
    </div>
  );
}
