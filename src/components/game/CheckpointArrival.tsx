'use client';
import { useEffect, useRef, useState } from 'react';
import type { Checkpoint } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { QrScanner } from './lazy';

type LatLng = { lat: number; lng: number };
type GpsState = 'idle' | 'locating' | 'arrived' | 'far' | 'off' | 'error';

/** Great-circle distance in metres. */
function distanceMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function formatDistance(m: number, locale: Locale): string {
  const km = m >= 1000;
  return new Intl.NumberFormat(locale, { style: 'unit', unit: km ? 'kilometer' : 'meter', maximumFractionDigits: km ? 1 : 0 }).format(
    km ? m / 1000 : Math.round(m),
  );
}

/**
 * The checkpoint arrival control. For a checkpoint with coordinates it offers a GPS "I'm here" check
 * (on-device only), and if a QR code is set, a camera scan. Manual confirmation is always available
 * (weak GPS, no camera, indoors, accessibility, and simulated demo checkpoints).
 */
export function CheckpointArrival({
  checkpoint,
  locale,
  t,
  onArrive,
  onPosition,
  radiusM = 40,
}: {
  checkpoint: Checkpoint;
  locale: Locale;
  t: Dictionary['game'];
  onArrive: () => void;
  onPosition: (p: LatLng | null) => void;
  radiusM?: number;
}) {
  const coords = checkpoint.coordinates;
  const gpsAvailable =
    !!coords && checkpoint.verification.includes('gps') && typeof navigator !== 'undefined' && 'geolocation' in navigator;
  const qrAvailable = !!checkpoint.code && checkpoint.verification.includes('qr');

  const [state, setState] = useState<GpsState>('idle');
  const [distance, setDistance] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const stallTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(stallTimer.current), []);

  function check() {
    setState('locating');
    clearTimeout(stallTimer.current);
    stallTimer.current = setTimeout(() => setState((s) => (s === 'locating' ? 'error' : s)), 15000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(stallTimer.current);
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onPosition(here);
        const d = distanceMeters(here, coords!);
        setDistance(d);
        const tolerance = Math.min(pos.coords.accuracy || 0, 60);
        // Don't override an arrival already confirmed by a QR scan while this was in flight.
        setState((s) => (s === 'arrived' ? s : d <= radiusM + tolerance ? 'arrived' : 'far'));
      },
      (err) => {
        clearTimeout(stallTimer.current);
        setState((s) => (s === 'arrived' ? s : err.code === err.PERMISSION_DENIED ? 'off' : 'error'));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  // No GPS and no QR for this checkpoint: the original single manual button.
  if (!gpsAvailable && !qrAvailable) {
    return (
      <button type="button" className="btn-gold mt-5 w-full sm:w-auto" onClick={onArrive}>
        {t.arrive}
      </button>
    );
  }

  if (scanning) {
    return (
      <QrScanner
        code={checkpoint.code!}
        t={t}
        onMatch={() => {
          clearTimeout(stallTimer.current);
          setScanning(false);
          setState('arrived');
        }}
        onClose={() => setScanning(false)}
      />
    );
  }

  const message =
    state === 'locating' ? { text: t.gpsLocating, tone: 'text-ivory-dim' }
    : state === 'far' && distance != null ? { text: t.gpsFar.replace('{d}', formatDistance(distance, locale)), tone: 'text-gold-soft' }
    : state === 'arrived' ? { text: t.gpsArrived, tone: 'text-success' }
    : state === 'off' ? { text: t.gpsOff, tone: 'text-danger' }
    : state === 'error' ? { text: t.gpsError, tone: 'text-danger' }
    : null;

  const primaryLabel =
    state === 'locating' ? t.gpsLocating : state === 'far' || state === 'error' ? t.gpsCheckAgain : t.gpsHere;

  return (
    <div className="mt-5 space-y-3">
      {message && (
        <p role="status" className={`text-sm ${message.tone}`}>
          {message.text}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {state === 'arrived' ? (
          <button type="button" className="btn-gold" onClick={onArrive}>
            {t.gpsContinue}
          </button>
        ) : (
          <>
            {gpsAvailable && (
              <button type="button" className="btn-gold" onClick={check} disabled={state === 'locating'}>
                {primaryLabel}
              </button>
            )}
            {qrAvailable && (
              <button type="button" className={gpsAvailable ? 'btn-ghost' : 'btn-gold'} onClick={() => setScanning(true)}>
                {t.qrScan}
              </button>
            )}
            <button type="button" className="btn-ghost" onClick={onArrive}>
              {t.gpsManual}
            </button>
          </>
        )}
      </div>
      {state !== 'arrived' && gpsAvailable && <p className="text-xs text-ivory-mute">{t.gpsNote}</p>}
    </div>
  );
}
