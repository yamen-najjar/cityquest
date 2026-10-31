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

/**
 * WebGL backed by a real GPU. On a software renderer (SwiftShader, llvmpipe: machines without a usable
 * GPU, and CI runners) the cinematic scenes run at a few frames per second and stall the whole page, so
 * 3D starts off there unless the player switches it on.
 */
export function hardwareWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const opts = { failIfMajorPerformanceCaveat: true };
    const gl = (c.getContext('webgl2', opts) ?? c.getContext('webgl', opts)) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
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

/**
 * true when 3D can and should be shown. With no saved choice: on when WebGL runs on a real GPU. A player
 * who switched 3D on gets it wherever WebGL works at all; one who switched it off never does.
 */
export function use3D(): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let pref: string | null = null;
    try {
      pref = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* no saved choice */
    }
    setOn(pref === 'on' ? webglAvailable() : pref !== 'off' && hardwareWebGL());
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
