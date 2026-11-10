'use client';

// Gets a game ready for play without reception, while there still is reception: stores the answer pack,
// sends any answers solved offline earlier, and makes sure the page, its lazily loaded modules and the
// adventure's files are in the service worker's caches. Reports two things for the screen:
//   offline  – there is no reception right now
//   ready    – everything above is done on this device (a quiet line on the start screen)
import { useEffect, useState } from 'react';
import type { Adventure } from '@/content/types';
import { flushQueue, loadUsablePack, refreshPack } from '@/lib/engine/answer-client';
import { hardwareWebGL, webglAvailable } from '../three/support';

const READY_PREFIX = 'cityquest:offline-ready:';

const online = () => typeof navigator === 'undefined' || navigator.onLine !== false;

/** The adventure's chapters' cutscenes, so the 3D files they need are fetched (and cached) up front. */
function scenesOf(a: Adventure) {
  return a.chapters.flatMap((c) => [c.scenes?.intro, c.scenes?.success]);
}

/** The same decision as use3D(): the saved choice, else whether there is a real GPU. */
function wants3D(): boolean {
  let pref: string | null = null;
  try {
    pref = window.localStorage.getItem('cityquest:3d');
  } catch {
    /* no saved choice */
  }
  return pref === 'on' ? webglAvailable() : pref !== 'off' && hardwareWebGL();
}

type Connection = { saveData?: boolean; effectiveType?: string };
const connection = (): Connection | undefined => (navigator as Navigator & { connection?: Connection }).connection;

/** Data saver on, or a 2G-class connection: only the pack and the page itself are fetched. */
function lowData(): boolean {
  const c = connection();
  return !!c?.saveData || c?.effectiveType === 'slow-2g' || c?.effectiveType === '2g';
}

/** Loads the lazy chunks (map, scanner, 3D) and, where 3D is shown, the 3D files the adventure uses, so the service worker sees them. */
async function loadLazyParts(a: Adventure) {
  // The chunks are small and always loaded, so a player who switches 3D on later still has them. The 3D
  // files are several megabytes: fetched only where the game would show 3D (see use3D).
  const jobs: Promise<unknown>[] = [import('./RealMap'), import('./QrScanner'), import('../three/Artifact3D'), import('../three/Lock3D'), import('../three/Map3D'), import('../three/cutscene/Cutscene3D')];
  if (wants3D()) {
    jobs.push(import('../three/cutscene/preload').then((m) => Promise.allSettled(scenesOf(a).map((scene) => m.preloadScene(scene)))));
  }
  await Promise.allSettled(jobs);
}

/** Every same-origin file this page has loaded so far, plus any photo the adventure names. */
function seenUrls(a: Adventure): string[] {
  const urls = new Set<string>();
  for (const e of performance.getEntriesByType('resource')) {
    try {
      const u = new URL(e.name);
      if (u.origin === location.origin) urls.add(u.pathname + u.search);
    } catch {
      /* ignore */
    }
  }
  for (const m of JSON.stringify(a).match(/\/photos\/[^"\\]+/g) ?? []) urls.add(m);
  return [...urls];
}

export type WarmResult = { ok: boolean; cached?: number; failed?: number; bytes?: number };

function askWorker(worker: ServiceWorker, urls: string[]): Promise<WarmResult> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timer = window.setTimeout(() => resolve({ ok: false }), 60_000);
    channel.port1.onmessage = (e) => {
      window.clearTimeout(timer);
      resolve(e.data as WarmResult);
    };
    worker.postMessage({ type: 'warm', page: location.pathname, urls }, [channel.port2]);
  });
}

/** Exposed for the e2e test and for debugging: what the last warm-up cached. */
declare global {
  interface Window {
    __cqWarm?: WarmResult;
  }
}

async function warmUp(a: Adventure): Promise<boolean> {
  if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') return false;
  const registration = await navigator.serviceWorker.ready;
  const worker = registration.active;
  if (!worker) return false;
  // First the page and what it has loaded so far (the worker may have taken over after those loads), then
  // the lazy parts, then everything those added.
  await askWorker(worker, lowData() ? [] : seenUrls(a));
  if (lowData()) return true; // the pack and the page are on the device; the extras would cost data
  await loadLazyParts(a);
  const result = await askWorker(worker, seenUrls(a));
  window.__cqWarm = result;
  return result.ok;
}

/** `enabled: false` (the admin preview) does nothing at all: no pack, no queue, no caching. */
export function useOfflineSupport(a: Adventure, enabled = true): { offline: boolean; ready: boolean; hasPack: boolean } {
  const slug = a.slug;
  const [offline, setOffline] = useState(false);
  const [ready, setReady] = useState(false);
  const [hasPack, setHasPack] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let warming = false;
    setOffline(!online());

    const marker = () => {
      try {
        return window.localStorage.getItem(READY_PREFIX + slug);
      } catch {
        return null;
      }
    };
    const syncReady = async () => {
      const pack = await loadUsablePack(slug);
      if (cancelled) return;
      setHasPack(!!pack);
      setReady(!!pack && marker() === pack.version);
    };
    void syncReady();

    async function prepare() {
      if (!online() || warming) return;
      warming = true;
      try {
        await refreshPack(slug);
        void flushQueue(slug);
        const pack = await loadUsablePack(slug);
        void syncReady();
        if (!pack || cancelled) return;
        if (marker() === pack.version) return;
        // The worker may still be installing on the very first visit, or a request may stall: try a few times.
        let warmed = false;
        for (let attempt = 0; attempt < 3 && !warmed && !cancelled && online(); attempt++) {
          if (attempt) await new Promise((r) => setTimeout(r, 3000 * attempt));
          warmed = await warmUp(a);
        }
        if (warmed) {
          try {
            window.localStorage.setItem(READY_PREFIX + slug, pack.version);
          } catch {
            /* private mode: the line just does not show */
          }
          void syncReady();
        }
      } finally {
        warming = false;
      }
    }

    const onOnline = () => {
      setOffline(false);
      void prepare();
    };
    const onOffline = () => setOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    void prepare();
    return () => {
      cancelled = true;
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [a, slug, enabled]);

  return { offline: enabled && offline, ready, hasPack };
}
