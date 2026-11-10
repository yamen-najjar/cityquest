'use client';

// Registers the service worker (public/sw.js) that keeps the game playable without reception. Production
// builds only: a worker caching dev files would hide edits. Mounted once in the locale layout.
import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((err) => {
      // Not fatal: the site and the game work as before, just not offline.
      console.warn('CityQuest: service worker not registered.', err);
    });
  }, []);
  return null;
}
