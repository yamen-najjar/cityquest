'use client';
import { useEffect, useRef, useState } from 'react';
import type { Checkpoint } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';

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
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: km ? 'kilometer' : 'meter',
    maximumFractionDigits: km ? 1 : 0,
  }).format(km ? m / 1000 : Math.round(m));
}

/**
 * The checkpoint arrival control. For a checkpoint with coordinates and GPS verification it offers an
 * "I'm here" check that compares the device's location to the checkpoint within a radius — on the device
 * only, nothing is sent or stored. Manual confirmation is always available (weak GPS, indoors,
 * accessibility, and simulated demo checkpoints, where GPS cannot match).
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
  const [state, setState] = useState<GpsState>('idle');
  const [distance, setDistance] = useState<number | null>(null);
  const stallTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(stallTimer.current), []);

  function check() {
    setState('locating');
    // If the permission prompt is ignored, the geolocation timeout never starts, so guard with our own.
    clearTimeout(stallTimer.current);
    stallTimer.current = setTimeout(() => setState((s) => (s === 'locating' ? 'error' : s)), 15000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(stallTimer.current);
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onPosition(here);
        const d = distanceMeters(here, coords!);
        setDistance(d);
        // Allow for the fix's own accuracy (capped), so a weak signal at the spot isn't read as "far".
        const tolerance = Math.min(pos.coords.accuracy || 0, 60);
        setState(d <= radiusM + tolerance ? 'arrived' : 'far');
      },
      (err) => {
        clearTimeout(stallTimer.current);
        setState(err.code === err.PERMISSION_DENIED ? 'off' : 'error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  // No GPS for this checkpoint: the original single manual button.
  if (!gpsAvailable) {
    return (
      <button type="button" className="btn-gold mt-5 w-full sm:w-auto" onClick={onArrive}>
        {t.arrive}
      </button>
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
            <button type="button" className="btn-gold" onClick={check} disabled={state === 'locating'}>
              {primaryLabel}
            </button>
            <button type="button" className="btn-ghost" onClick={onArrive}>
              {t.gpsManual}
            </button>
          </>
        )}
      </div>
      {state !== 'arrived' && <p className="text-xs text-ivory-mute">{t.gpsNote}</p>}
    </div>
  );
}
