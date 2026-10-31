'use client';
import { useEffect, useRef } from 'react';
import maplibregl, { type StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Chapter } from '@/content/types';
import type { Locale } from '@/i18n/config';

// Keyless fallback style (OpenStreetMap raster) used when NEXT_PUBLIC_MAP_STYLE_URL is unset, so the map
// works in dev, CI and fresh clones with no API key. For production, set a style from a provider with a
// domain-restricted key (e.g. MapTiler) — OSM's tile servers are for light/dev use only.
const OSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

type LatLng = { lat: number; lng: number };

function pin(n: number, state: 'solved' | 'current' | 'upcoming'): HTMLElement {
  const el = document.createElement('div');
  const bg = state === 'solved' ? '#DDB66A' : state === 'current' ? '#F8F4EC' : '#273C5E';
  const fg = state === 'upcoming' ? '#DDB66A' : '#0B1324';
  el.textContent = String(n);
  el.style.cssText = `width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font:700 13px/1 system-ui,sans-serif;color:${fg};background:${bg};border:2px solid #DDB66A;box-shadow:0 2px 6px rgba(0,0,0,.5);${
    state === 'current' ? 'outline:4px solid rgba(221,182,106,.3);' : ''
  }`;
  return el;
}

export default function RealMap({
  chapters,
  current,
  solved,
  locale,
  labels,
  userPosition,
}: {
  chapters: Chapter[];
  current: number;
  solved: string[];
  locale: Locale;
  labels: { title: string; note: string; destination: string; done: string };
  userPosition?: LatLng | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const loadedRef = useRef(false);

  const located = chapters.map((c, i) => ({ c, i })).filter((x) => x.c.checkpoint.coordinates);
  const here = chapters[current];

  // Initialise the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current || located.length === 0) return;
    const first = located[0]!.c.checkpoint.coordinates!;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: process.env.NEXT_PUBLIC_MAP_STYLE_URL || OSM_STYLE,
      center: [first.lng, first.lat],
      zoom: 13,
      attributionControl: { compact: true },
      cooperativeGestures: true,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;
    map.on('load', () => {
      loadedRef.current = true;
      map.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: located.map((x) => [x.c.checkpoint.coordinates!.lng, x.c.checkpoint.coordinates!.lat]) } },
      });
      map.addLayer({ id: 'route', type: 'line', source: 'route', paint: { 'line-color': '#DDB66A', 'line-width': 3, 'line-opacity': 0.6, 'line-dasharray': [2, 1.5] } });
      renderMarkers();
      fit();
    });
    return () => {
      map.remove();
      mapRef.current = null;
      loadedRef.current = false;
      markersRef.current = [];
      userMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fit() {
    const map = mapRef.current;
    if (!map || located.length === 0) return;
    const b = new maplibregl.LngLatBounds();
    for (const x of located) b.extend([x.c.checkpoint.coordinates!.lng, x.c.checkpoint.coordinates!.lat]);
    if (userPosition) b.extend([userPosition.lng, userPosition.lat]);
    map.fitBounds(b, { padding: 48, maxZoom: 16, duration: 0 });
  }

  function renderMarkers() {
    const map = mapRef.current;
    if (!map) return;
    for (const m of markersRef.current) m.remove();
    markersRef.current = located.map((x) => {
      const state = solved.includes(x.c.id) ? 'solved' : x.i === current ? 'current' : 'upcoming';
      const coord = x.c.checkpoint.coordinates!;
      return new maplibregl.Marker({ element: pin(x.i + 1, state) }).setLngLat([coord.lng, coord.lat]).addTo(map);
    });
  }

  // Re-colour markers when the current chapter or solved set changes.
  useEffect(() => {
    if (loadedRef.current) renderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, solved.length]);

  // Show / move the player's own position (passed in during GPS checks).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!userPosition) {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      return;
    }
    const el = userMarkerRef.current?.getElement() ?? document.createElement('div');
    el.style.cssText = 'width:16px;height:16px;border-radius:50%;background:#6FA8DC;border:2px solid #fff;box-shadow:0 0 0 6px rgba(111,168,220,.25)';
    if (!userMarkerRef.current) userMarkerRef.current = new maplibregl.Marker({ element: el }).setLngLat([userPosition.lng, userPosition.lat]).addTo(map);
    else userMarkerRef.current.setLngLat([userPosition.lng, userPosition.lat]);
  }, [userPosition]);

  return (
    <figure className="m-0 overflow-hidden rounded-2xl border border-white/10 bg-navy-800">
      <div ref={containerRef} className="h-72 w-full" role="img" aria-label={`${labels.title}. ${labels.note}`} />
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3 text-xs">
        {here ? (
          <span>
            <span className="text-ivory-mute">{labels.destination}: </span>
            <span className="text-ivory">{here.checkpoint.name[locale]}</span>
          </span>
        ) : (
          <span className="text-gold">{labels.done}</span>
        )}
        <span className="text-ivory-mute">{labels.note}</span>
      </figcaption>
    </figure>
  );
}
