import { useId } from 'react';
import type { Dictionary } from '@/i18n/dictionary';
import { fmt } from '@/i18n/fmt';

type Pt = [number, number];
type Anchor = 'start' | 'middle' | 'end';
type PlaceKey = 'start' | 'devilsHouse' | 'church' | 'park';
interface Shape {
  viewBox: string;
  width: number;
  riverY: number;
  riverLabel: Pt;
  /** The eight checkpoints in order; the first is the start. */
  cps: Pt[];
  r: number;
  /** Labels name the checkpoints that are at a place: 1 Korenmarkt, 2 Devil's House, 4 Eusebius church, 5 Sonsbeek park. */
  labels: { cp: number; key: PlaceKey; dx: number; dy: number; anchor: Anchor }[];
}

// A schematic of the Arnhem route, not a map: a wide drawing for desktop and a tall one for phones. The
// checkpoints that the story sets at a named place (chapters 1, 2, 4 and 5 in het-duivelshuis.ts) carry that
// name; the line between them is only a sketch until the route has been walked.
const wide: Shape = {
  viewBox: '0 0 960 440',
  width: 960,
  riverY: 410,
  riverLabel: [0, 392],
  cps: [[110, 90], [230, 90], [350, 160], [470, 160], [590, 230], [710, 300], [820, 300], [880, 370]],
  r: 17,
  labels: [
    { cp: 0, key: 'start', dx: 0, dy: -38, anchor: 'middle' },
    { cp: 1, key: 'devilsHouse', dx: 0, dy: -38, anchor: 'middle' },
    { cp: 3, key: 'church', dx: 0, dy: -38, anchor: 'middle' },
    { cp: 4, key: 'park', dx: 0, dy: -38, anchor: 'middle' },
  ],
};
const tall: Shape = {
  viewBox: '0 0 360 580',
  width: 360,
  riverY: 528,
  riverLabel: [0, 562],
  cps: [[64, 40], [64, 115], [124, 185], [124, 260], [184, 330], [184, 400], [304, 445], [304, 490]],
  r: 14,
  labels: [
    { cp: 0, key: 'start', dx: 26, dy: 5, anchor: 'start' },
    { cp: 1, key: 'devilsHouse', dx: 26, dy: 5, anchor: 'start' },
    { cp: 3, key: 'church', dx: 26, dy: 5, anchor: 'start' },
    { cp: 4, key: 'park', dx: 26, dy: 5, anchor: 'start' },
  ],
};

function Drawing({ shape, className, labels, aria }: { shape: Shape; className: string; labels: Dictionary['adventure']['map']; aria: string }) {
  const id = useId();
  const [sx, sy] = shape.cps[0] as Pt;
  return (
    <svg className={className} viewBox={shape.viewBox} role="img" aria-labelledby={id}>
      <title id={id}>{aria}</title>
      <path className="ad-m-river" d={`M0 ${shape.riverY} H${shape.width}`} />
      <text className="ad-m-label ad-m-label--river" x={shape.riverLabel[0]} y={shape.riverLabel[1]}>
        {labels.river}
      </text>
      <polyline className="ad-m-line" points={shape.cps.map((p) => p.join(',')).join(' ')} />
      <circle className="ad-m-startring" cx={sx} cy={sy} r={shape.r + 8} />
      {shape.cps.map(([x, y], i) => (
        <g key={i} className="ad-m-cp">
          <circle cx={x} cy={y} r={shape.r} />
          <text x={x} y={y}>
            {i + 1}
          </text>
        </g>
      ))}
      {shape.labels.map((l) => {
        const [x, y] = shape.cps[l.cp] as Pt;
        return (
          <text key={l.key} className="ad-m-label" x={x + l.dx} y={y + l.dy} textAnchor={l.anchor}>
            {labels[l.key]}
          </text>
        );
      })}
    </svg>
  );
}

export function DuivelshuisMap({ labels, checkpoints }: { labels: Dictionary['adventure']['map']; checkpoints: number }) {
  const aria = fmt(labels.aria, { n: checkpoints });
  return (
    <>
      <Drawing shape={wide} className="ad-map--wide" labels={labels} aria={aria} />
      <Drawing shape={tall} className="ad-map--tall" labels={labels} aria={aria} />
    </>
  );
}
