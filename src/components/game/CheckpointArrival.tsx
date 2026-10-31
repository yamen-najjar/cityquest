'use client';
import { useState } from 'react';
import type { Checkpoint } from '@/content/types';
import type { Dictionary } from '@/i18n/dictionary';

type LatLng = { lat: number; lng: number };
type GpsState = 'idle' | 'locating' | 'arrived' | 'far' | 'off' | 'error';

/** Great-circle distance in metres. */
function distanceMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * The checkpoint arrival control. For a checkpoint with coordinates and GPS verification it offers an
 * "I'm here" check that compares the device's location to the checkpoint within a radius — on the device
 * only, nothing is sent or stored. Manual confirmation is always available (weak GPS, indoors,
 * accessibility, and simulated demo checkpoints, where GPS cannot match).
 */
export function CheckpointArrival({
  checkpoint,
  t,
  onArrive,
  onPosition,
  radiusM = 40,
}: {
  checkpoint: Checkpoint;
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

  const fmtDist = (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`);

  function check() {
    setState('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onPosition(here);
        const d = distanceMeters(here, coords!);
        setDistance(d);
        setState(d <= radiusM ? 'arrived' : 'far');
      },
      (err) => setState(err.code === err.PERMISSION_DENIED ? 'off' : 'error'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
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
    : state === 'far' && distance != null ? { text: t.gpsFar.replace('{d}', fmtDist(distance)), tone: 'text-gold-soft' }
    : state === 'arrived' ? { text: t.gpsArrived, tone: 'text-success' }
    : state === 'off' ? { text: t.gpsOff, tone: 'text-danger' }
    : state === 'error' ? { text: t.gpsError, tone: 'text-danger' }
    : checkpoint.simulated ? { text: t.gpsSimulatedNote, tone: 'text-ivory-mute' }
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
