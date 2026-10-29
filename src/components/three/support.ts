'use client';

// Kept apart from viewer.ts so the game can decide between 3D and 2D without loading three.js.
import { useEffect, useState } from 'react';

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

const STORAGE_KEY = 'cityquest:3d';

/**
 * Called when a 3D element could not start (no GPU context, a driver error): the game falls back to 2D
 * for this page view, without changing the player's saved choice.
 */
export function report3DFailure(error: unknown) {
  console.warn('CityQuest: 3D unavailable, falling back to 2D.', error);
  window.dispatchEvent(new CustomEvent('cityquest:3d', { detail: false }));
}

/** true when 3D can and should be shown: WebGL works and the player has not switched 3D off. */
export function use3D(): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let pref = 'on';
    try {
      pref = window.localStorage.getItem(STORAGE_KEY) ?? 'on';
    } catch {
      /* default on */
    }
    setOn(pref !== 'off' && webglAvailable());
    const sync = (e: Event) => setOn((e as CustomEvent<boolean>).detail && webglAvailable());
    window.addEventListener('cityquest:3d', sync);
    return () => window.removeEventListener('cityquest:3d', sync);
  }, []);
  const set = (value: boolean) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off');
    } catch {
      /* per page only */
    }
    window.dispatchEvent(new CustomEvent('cityquest:3d', { detail: value }));
  };
  return [on, set];
}
