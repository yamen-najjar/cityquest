/* CityQuest service worker: keeps the game playable without reception.
 *
 * Hand-written on purpose (no workbox). What it does, by kind of request:
 *   /_next/static/*        cache-first (the files are content-hashed, so never stale)
 *   page navigations       network-first (3 s), then the cached page, then an offline page
 *   Next RSC requests      network only: when it fails, Next falls back to a normal page load, which the
 *                          navigation rule above then serves from the cache (so links degrade gracefully)
 *   /photos, /assets, /_next/image, icons, fonts   stale-while-revalidate
 *   map tiles              only the tiles the player actually looked at, capped (never prefetched)
 * It never touches /api/*, /admin*, auth routes, the account pages or anything on another origin
 * (Supabase included): those go straight to the network. Answers are never cached here; the game keeps
 * its own answer pack in localStorage (see src/lib/engine/answer-client.ts).
 *
 * Bump VERSION to throw every cache away on the next activation. A new deploy needs no bump: its pages and
 * chunks have new names, and the trimming below drops the oldest first, so a stored old page keeps its
 * chunks until hundreds of newer files have come in after it.
 */
const VERSION = 'v1';
const STATIC = `cq-static-${VERSION}`;
const PAGES = `cq-pages-${VERSION}`;
const MEDIA = `cq-media-${VERSION}`;
const TILES = `cq-tiles-${VERSION}`;
const ALL_CACHES = [STATIC, PAGES, MEDIA, TILES];

// Responses vary by Accept (images) or RSC headers (pages); the cache is keyed by URL alone.
const IGNORE_VARY = { ignoreVary: true };
const LOCALES = ['de', 'en', 'nl', 'ar'];
const NETWORK_TIMEOUT_MS = 3000;
/** The worker's own background fetches (install, warm-up) give up after this, so a stalled one never blocks it. */
const BACKGROUND_FETCH_TIMEOUT_MS = 20000;
const background = (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(BACKGROUND_FETCH_TIMEOUT_MS) });
const TILE_HOST = 'tile.openstreetmap.org';
const MAX_TILES = 300;
const TILE_MAX_AGE_MS = 14 * 24 * 3600 * 1000;
const MAX_STATIC = 600;
const MAX_PAGES = 60;
const MAX_MEDIA = 250;

// Pages that must never be stored: they can hold a person's data or a one-time token.
const PRIVATE_PATH = /^\/(?:(?:de|en|nl|ar)\/(?:account|auth|newsletter)(?:\/|$)|admin(?:\/|$)|api(?:\/|$))/;

const localeOf = (pathname) => {
  const first = pathname.split('/')[1];
  return LOCALES.includes(first) ? first : null;
};
const offlineUrl = (locale) => `/${locale}/offline`;

// ---- install / activate -------------------------------------------------------------------------------

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      // The offline page of every language, with the scripts and styles it needs, so it can be shown
      // when nothing else is cached.
      const pages = await caches.open(PAGES);
      const statics = await caches.open(STATIC);
      // One language after the other: the pages share most of their files. Never let a slow network keep
      // the worker from activating: after 20 s it starts anyway, with whatever is cached by then.
      const precache = (async () => {
        for (const locale of LOCALES) {
          try {
            const res = await background(offlineUrl(locale), { credentials: 'same-origin' });
            if (!res.ok) {
              await res.body?.cancel();
              continue;
            }
            await pages.put(offlineUrl(locale), res.clone());
            await cacheReferencedAssets(await res.text(), statics);
          } catch {
            /* that language's offline page is simply not available offline */
          }
        }
      })();
      await Promise.race([precache, new Promise((resolve) => setTimeout(resolve, 20000))]);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys()) if (name.startsWith('cq-') && !ALL_CACHES.includes(name)) await caches.delete(name);
      await self.clients.claim();
    })(),
  );
});

/** Caches the /_next/static files an HTML page (and its stylesheets) points at. */
async function cacheReferencedAssets(html, cache) {
  // In HTML a path may hold parentheses ("(site)"); in a stylesheet a url(...) ends at one.
  const inHtml = /\/_next\/static\/[^"'\\\s<>]+/g;
  const urls = new Set(html.match(inHtml) || []);
  for (const url of [...urls]) {
    if (!url.endsWith('.css')) continue;
    try {
      const res = await background(url);
      if (!res.ok) {
        await res.body?.cancel();
        continue;
      }
      await cache.put(url, res.clone());
      for (const m of (await res.text()).match(/\/_next\/static\/media\/[^"'\\\s)]+/g) || []) urls.add(m);
    } catch {
      /* a missing stylesheet only costs styling */
    }
  }
  await Promise.allSettled(
    [...urls].map(async (url) => {
      if (await cache.match(url)) return;
      const res = await background(url);
      if (res.ok) await cache.put(url, res);
      else await res.body?.cancel(); // an unread body keeps its connection busy
    }),
  );
}

// ---- helpers ------------------------------------------------------------------------------------------

// Oldest first. The remembered locale is not a page and is never trimmed.
async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = (await cache.keys()).filter((key) => !key.url.endsWith('/__locale'));
  for (const key of keys.slice(0, Math.max(0, keys.length - max))) await cache.delete(key);
}

const cacheable = (res) => res && res.ok && res.type !== 'opaque' && !/no-store/i.test(res.headers.get('Cache-Control') || '');

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (v) => (clearTimeout(timer), resolve(v)),
      (e) => (clearTimeout(timer), reject(e)),
    );
  });
}

// ---- strategies ---------------------------------------------------------------------------------------

async function cacheFirst(event, request, cacheName, max) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request, IGNORE_VARY);
  if (hit) return hit;
  const res = await fetch(request);
  if (cacheable(res)) {
    await cache.put(request, res.clone());
    event.waitUntil(trim(cacheName, max));
  }
  return res;
}

async function staleWhileRevalidate(event, request, cacheName, max) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request, IGNORE_VARY);
  const refresh = fetch(request)
    .then(async (res) => {
      if (cacheable(res)) {
        await cache.put(request, res.clone());
        await trim(cacheName, max);
      }
      return res;
    })
    .catch(() => undefined);
  if (hit) {
    event.waitUntil(refresh);
    return hit;
  }
  return (await refresh) || Response.error();
}

/** A map tile: only what the player has looked at, newest kept; a tile older than 14 days is re-fetched. */
async function tile(request) {
  const cache = await caches.open(TILES);
  const hit = await cache.match(request, IGNORE_VARY);
  const age = hit ? Date.now() - new Date(hit.headers.get('Date') || 0).getTime() : Infinity;
  if (hit && age < TILE_MAX_AGE_MS) return hit;
  try {
    const res = await fetch(request);
    if (cacheable(res)) {
      await cache.put(request, res.clone());
      await trim(TILES, MAX_TILES);
    }
    return res;
  } catch (err) {
    if (hit) return hit;
    throw err;
  }
}

async function navigate(event, request) {
  const url = new URL(request.url);
  const pages = await caches.open(PAGES);
  // Keyed by path and query: the catalogue and city pages differ by their filters.
  const key = url.pathname + url.search;
  // The page is handed back first; storing it (and trimming) happens after, kept alive by waitUntil.
  const network = fetch(request).then((res) => {
    if (res.ok && res.type === 'basic' && !res.redirected && !PRIVATE_PATH.test(url.pathname)) {
      const copy = res.clone();
      event.waitUntil(
        (async () => {
          await pages.put(key, copy);
          const locale = localeOf(url.pathname);
          if (locale) await pages.put('/__locale', new Response(locale));
          await trim(PAGES, MAX_PAGES);
        })().catch(() => undefined),
      );
    }
    return res;
  });
  const cached = await pages.match(key, IGNORE_VARY);
  if (!cached) {
    // Nothing stored: a slow network is just slow. The offline page only when the request fails.
    try {
      return await network;
    } catch {
      return offlineFallback(pages, url);
    }
  }
  // Something stored: wait a moment for fresh content, then show what is stored while the request finishes.
  try {
    return await withTimeout(network, NETWORK_TIMEOUT_MS);
  } catch {
    event.waitUntil(network.catch(() => undefined));
    return cached;
  }
}

async function offlineFallback(pages, url) {
  const saved = await pages.match('/__locale');
  const last = saved ? await saved.text() : null;
  const locale = localeOf(url.pathname) || (LOCALES.includes(last) ? last : 'en');
  // A bare "/" is the app's start address: send it to the language the visitor used last.
  if (url.pathname === '/' && last) {
    const home = await pages.match(`/${last}`);
    if (home) return home;
  }
  return (
    (await pages.match(offlineUrl(locale))) ||
    new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Offline</title><p style="font:18px system-ui;padding:2rem">You are offline.</p>', {
      status: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  );
}

// ---- routing ------------------------------------------------------------------------------------------

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);

  if (url.hostname === TILE_HOST) {
    event.respondWith(tile(request));
    return;
  }
  if (url.origin !== self.location.origin) return; // Supabase, fonts hosts, anything else: untouched

  const path = url.pathname;
  if (PRIVATE_PATH.test(path) || path === '/sw.js') return;

  // Next's data requests for client-side navigation: not cached, see the header comment.
  if (request.headers.get('RSC') === '1' || url.searchParams.has('_rsc')) return;

  if (path.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(event, request, STATIC, MAX_STATIC));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(navigate(event, request));
    return;
  }
  if (path.startsWith('/_next/image') || path.startsWith('/photos/') || path.startsWith('/assets/') || /^\/(?:icon\.svg|icons\/|apple-touch-icon|manifest\.webmanifest)/.test(path)) {
    event.respondWith(staleWhileRevalidate(event, request, MEDIA, MAX_MEDIA));
  }
});

// ---- warm-up ------------------------------------------------------------------------------------------
// The game page asks for everything it has used (and the page itself) to be stored, after it has loaded
// the lazy modules and 3D files. Reply: how many files are now cached and how big they are.

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'warm' || !event.ports[0]) return;
  const reply = (body) => event.ports[0].postMessage(body);
  event.waitUntil(warm(data).then(reply, () => reply({ ok: false })));
});

async function warm({ page, urls }) {
  const stats = { ok: true, cached: 0, failed: 0, bytes: 0 };
  const pageUrl = new URL(page, self.location.origin);
  if (pageUrl.origin === self.location.origin && !PRIVATE_PATH.test(pageUrl.pathname)) {
    try {
      const pages = await caches.open(PAGES);
      const res = await background(pageUrl.pathname, { headers: { Accept: 'text/html' } });
      if (res.ok && res.type === 'basic') {
        await pages.put(pageUrl.pathname, res.clone());
        await cacheReferencedAssets(await res.text(), await caches.open(STATIC));
        stats.cached++;
      }
    } catch {
      stats.failed++;
    }
  }
  for (const raw of urls || []) {
    let url;
    try {
      url = new URL(raw, self.location.origin);
    } catch {
      continue;
    }
    if (url.origin !== self.location.origin || PRIVATE_PATH.test(url.pathname)) continue;
    const p = url.pathname;
    const cacheName = p.startsWith('/_next/static/') ? STATIC : p.startsWith('/_next/image') || p.startsWith('/photos/') || p.startsWith('/assets/') ? MEDIA : null;
    if (!cacheName) continue;
    try {
      const cache = await caches.open(cacheName);
      let res = await cache.match(url.pathname + url.search, IGNORE_VARY);
      if (!res) {
        res = await background(url.pathname + url.search);
        if (!cacheable(res)) throw new Error('not cacheable');
        await cache.put(url.pathname + url.search, res.clone());
        stats.cached++;
      }
      stats.bytes += Number(res.headers.get('Content-Length')) || (await res.clone().arrayBuffer()).byteLength;
    } catch {
      stats.failed++;
    }
  }
  await Promise.all([trim(STATIC, MAX_STATIC), trim(MEDIA, MAX_MEDIA)]);
  return stats;
}
