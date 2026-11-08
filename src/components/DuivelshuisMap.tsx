import { useId } from 'react';
import type { Dictionary } from '@/i18n/dictionary';
import { fmt } from '@/i18n/fmt';

type Pt = [number, number];
type Anchor = 'start' | 'middle' | 'end';
interface Shape {
  viewBox: string;
  river: { y: number; label: { x: number; y: number } };
  line: string;
  start: Pt;
  startLabel: { x: number; y: number; anchor: Anchor };
  cps: Pt[];
  r: number;
  places: { key: string; box: Pt; label: { x: number; y: number; anchor: Anchor } }[];
  size: number;
}

// A schematic of the Arnhem route, not a map: a wide drawing for desktop and a tall one for phones.
// The labels name real places the route passes (Korenmarkt, Devil's House, Eusebius church, Sonsbeek park,
// the Rhine); the line between them is only a sketch until the route has been walked.
const wide: Shape = {
  viewBox: '0 0 960 440',
  river: { y: 410, label: { x: 0, y: 392 } },
  line: '140,300 240,300 320,220 440,220 520,140 600,60 720,60 800,140 800,260 880,340',
  start: [140, 300],
  startLabel: { x: 140, y: 342, anchor: 'middle' as const },
  cps: [[240, 300], [320, 220], [440, 220], [520, 140], [600, 60], [800, 140], [800, 260], [880, 340]],
  r: 17,
  places: [
    { key: 'devilsHouse', box: [373, 213], label: { x: 380, y: 196, anchor: 'middle' as const } },
    { key: 'church', box: [473, 173], label: { x: 498, y: 198, anchor: 'start' as const } },
    { key: 'park', box: [653, 53], label: { x: 660, y: 36, anchor: 'middle' as const } },
  ],
  size: 14,
};
const tall: Shape = {
  viewBox: '0 0 360 580',
  river: { y: 528, label: { x: 0, y: 562 } },
  line: '64,420 64,350 124,290 124,210 184,150 184,70 244,70 304,130 304,300 304,440',
  start: [64, 420],
  startLabel: { x: 64, y: 458, anchor: 'middle' as const },
  cps: [[64, 350], [124, 290], [124, 210], [184, 150], [184, 70], [304, 130], [304, 300], [304, 440]],
  r: 14,
  places: [
    { key: 'devilsHouse', box: [118, 244], label: { x: 108, y: 255, anchor: 'end' as const } },
    { key: 'church', box: [148, 174], label: { x: 138, y: 172, anchor: 'end' as const } },
    { key: 'park', box: [208, 64], label: { x: 214, y: 44, anchor: 'middle' as const } },
  ],
  size: 12,
};

function Drawing({ shape, className, labels, aria }: { shape: Shape; className: string; labels: Dictionary['adventure']['map']; aria: string }) {
  const id = useId();
  const [sx, sy] = shape.start;
  const startR = shape.r === 17 ? 13 : 11;
  return (
    <svg className={className} viewBox={shape.viewBox} role="img" aria-labelledby={id}>
      <title id={id}>{aria}</title>
      <path className="ad-m-river" d={`M0 ${shape.river.y} H${shape.viewBox.split(' ')[2]}`} />
      <text className="ad-m-label ad-m-label--river" x={shape.river.label.x} y={shape.river.label.y}>
        {labels.river}
      </text>
      <polyline className="ad-m-line" points={shape.line} />
      {shape.places.map((p) => (
        <g key={p.key}>
          <rect className="ad-m-place" x={p.box[0]} y={p.box[1]} width={shape.size} height={shape.size} />
          <text className="ad-m-label" x={p.label.x} y={p.label.y} textAnchor={p.label.anchor}>
            {labels[p.key as 'devilsHouse' | 'church' | 'park']}
          </text>
        </g>
      ))}
      <g className="ad-m-start">
        <circle cx={sx} cy={sy} r={startR} />
        <circle cx={sx} cy={sy} r={shape.r === 17 ? 4.5 : 4} />
      </g>
      <text className="ad-m-label" x={shape.startLabel.x} y={shape.startLabel.y} textAnchor={shape.startLabel.anchor}>
        {labels.start}
      </text>
      {shape.cps.map(([x, y], i) => (
        <g key={i} className="ad-m-cp">
          <circle cx={x} cy={y} r={shape.r} />
          <text x={x} y={y}>
            {i + 1}
          </text>
        </g>
      ))}
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
