import type { Chapter } from '@/content/types';
import type { Locale } from '@/i18n/config';

/**
 * A stylised map of the demo's simulated checkpoints. It deliberately looks like a sketch, not a street
 * map, so nobody mistakes it for directions. Phase 4 replaces it with MapLibre and validated coordinates.
 */
export function DemoMap({
  chapters,
  current,
  solved,
  locale,
  labels,
}: {
  chapters: Chapter[];
  current: number;
  solved: string[];
  locale: Locale;
  labels: { title: string; note: string; destination: string; done: string };
}) {
  const pts = chapters.map((c) => ({ x: c.checkpoint.mapPosition.x, y: c.checkpoint.mapPosition.y * 0.7 }));
  const route = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
  const here = chapters[current];
  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-[#0E1A2E]">
      <svg viewBox="0 0 100 70" className="block h-auto w-full" role="img" aria-label={`${labels.title}. ${labels.note}`}>
        <defs>
          <pattern id="map-grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M5 0H0V5" fill="none" stroke="#F8F4EC" strokeOpacity=".04" strokeWidth=".3" />
          </pattern>
        </defs>
        <rect width="100" height="70" fill="url(#map-grid)" />
        {/* An imagined river, not a real one */}
        <path d="M-2 52 C 20 44 35 58 55 50 S 85 40 102 46" fill="none" stroke="#1C3A5E" strokeWidth="7" strokeLinecap="round" />
        <path d={route} fill="none" stroke="#DDB66A" strokeOpacity=".5" strokeWidth=".6" strokeDasharray="1.6 1.4" />
        {pts.map((p, i) => {
          const c = chapters[i]!;
          const isDone = solved.includes(c.id);
          const isHere = i === current;
          return (
            <g key={c.id}>
              {isHere && <circle cx={p.x} cy={p.y} r="4.5" fill="#DDB66A" opacity=".25" className="animate-shimmer" />}
              <circle cx={p.x} cy={p.y} r="2.4" fill={isDone ? '#DDB66A' : isHere ? '#F8F4EC' : '#273C5E'} stroke="#DDB66A" strokeWidth=".5" />
              <text x={p.x} y={p.y + 0.9} textAnchor="middle" fontSize="2.4" fontWeight="700" fill="#0B1324">
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
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
