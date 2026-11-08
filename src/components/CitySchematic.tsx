import Link from 'next/link';
import type { City } from '@/content/types';
import type { Locale } from '@/i18n/config';
import { fmt, type Dictionary } from '@/i18n/dictionary';
import { joinList } from '@/lib/lists';

const LEFT = 118;
const RIGHT = 284;
const TOP = 84;
const BOTTOM = 330;

interface Point {
  city: City;
  x: number;
  y: number;
}

/** Places the cities on a 400 x 400 sheet by their centres, to scale (east-west shortened by the latitude), so they stand where they lie relative to each other. */
function place(cities: City[]): Point[] {
  if (cities.length === 0) return [];
  const meanLat = cities.reduce((s, c) => s + c.center.lat, 0) / cities.length;
  const flat = cities.map((c) => ({ c, u: c.center.lng * Math.cos((meanLat * Math.PI) / 180), v: -c.center.lat }));
  const us = flat.map((f) => f.u);
  const vs = flat.map((f) => f.v);
  const du = Math.max(...us) - Math.min(...us);
  const dv = Math.max(...vs) - Math.min(...vs);
  const scale = Math.min(du ? (RIGHT - LEFT) / du : Infinity, dv ? (BOTTOM - TOP) / dv : Infinity);
  const s = Number.isFinite(scale) ? scale : 0;
  const midX = (LEFT + RIGHT) / 2;
  const midY = (TOP + BOTTOM) / 2;
  const cu = (Math.max(...us) + Math.min(...us)) / 2;
  const cv = (Math.max(...vs) + Math.min(...vs)) / 2;
  return flat.map((f) => ({ city: f.c, x: Math.round(midX + (f.u - cu) * s), y: Math.round(midY + (f.v - cv) * s) }));
}

/**
 * A schematic of where the cities lie relative to each other. It is a diagram, not a map; the page says so
 * next to it. Every city is a link; the current one is drawn larger, the others dimmed.
 */
export function CitySchematic({
  cities,
  locale,
  t,
  hrefFor,
  currentSlug,
  className = '',
}: {
  cities: City[];
  locale: Locale;
  t: Dictionary['cities'];
  hrefFor: (slug: string) => string;
  currentSlug?: string;
  className?: string;
}) {
  const points = place(cities);
  const status = (c: City) => (c.pilot ? t.pilot : c.status === 'available' ? t.available : t.comingSoon);
  // The northernmost country is named at the top, the others at the bottom.
  const countries = [...new Set(points.map((p) => p.city.country))].sort(
    (a, b) => Math.min(...points.filter((p) => p.city.country === a).map((p) => p.y)) - Math.min(...points.filter((p) => p.city.country === b).map((p) => p.y)),
  );
  const aria = fmt(t.schemaAria, { places: joinList(points.map((p) => `${p.city.name[locale]} (${t.countries[p.city.country]})`), locale) });
  return (
    <svg className={`cs-map ${className}`.trim()} viewBox="0 0 400 400" role="group" aria-label={aria}>
      {points.length > 1 && points.slice(1).map((p, i) => <line key={p.city.slug} x1={points[i]!.x} y1={points[i]!.y} x2={p.x} y2={p.y} className="cs-link" />)}
      {countries.map((c, i) => (
        <text key={c} x="30" y={i === 0 ? 40 : 380} className="cs-zone">
          {t.countries[c]}
        </text>
      ))}
      <g className="cs-north" transform="translate(360 46)" aria-hidden="true">
        <path d="M0 14V-10M-6 -3 0 -10 6 -3" />
        <text x="0" y="32" textAnchor="middle" className="cs-zone">
          {t.north}
        </text>
      </g>
      {points.map(({ city, x, y }) => {
        const here = city.slug === currentSlug;
        const dim = currentSlug !== undefined && !here;
        const left = x > 200;
        const tx = left ? x - 22 : x + 22;
        const label = here ? fmt(t.thisCity, { city: city.name[locale] }) : `${city.name[locale]}, ${t.countries[city.country]}`;
        return (
          <Link key={city.slug} href={hrefFor(city.slug)} aria-label={label} aria-current={here ? 'page' : undefined}>
            <g className={`cs-pt${dim ? ' cs-pt--dim' : ''}`}>
              <circle cx={x} cy={y} r={here ? 16 : 13} className="cs-pt__ring" />
              <circle cx={x} cy={y} r={here ? 8 : 6} className="cs-pt__dot" />
              <text x={tx} y={y + 6} textAnchor={left ? 'end' : 'start'} className="cs-pt__name">
                {city.name[locale]}
              </text>
              <text x={tx} y={y + 26} textAnchor={left ? 'end' : 'start'} className="cs-pt__sub">
                {status(city)}
              </text>
            </g>
          </Link>
        );
      })}
    </svg>
  );
}
