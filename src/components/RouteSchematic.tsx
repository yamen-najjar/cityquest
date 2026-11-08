import { useId } from 'react';
import { routeShapes } from '@/content/presentation';

/**
 * A schematic route: a start, numbered checkpoints, and, when a story has several endings, the fork.
 * It is a diagram, not a map; the page says so next to it.
 */
export function RouteSchematic({
  slug,
  endings = 0,
  solved,
  labels,
  className = '',
}: {
  slug: string;
  endings?: number;
  /** When given, the route shows progress: the solved part drawn, the next checkpoint ringed, the rest dim. No endings are drawn. */
  solved?: number;
  labels: { aria: string; start: string; endings: string };
  className?: string;
}) {
  const shape = routeShapes[slug];
  const titleId = useId();
  if (!shape) return null;
  const [sx, sy] = shape.start;
  const progress = solved !== undefined;
  const showEndings = !progress && endings > 2 && shape.branches;
  const whole = progress ? [shape.start, ...shape.checkpoints].map((pt) => pt.join(',')).join(' ') : shape.line;
  const done = progress && solved > 0 ? [shape.start, ...shape.checkpoints.slice(0, solved)].map((pt) => pt.join(',')).join(' ') : '';
  const stateOf = (i: number) => (!progress ? '' : i < solved ? ' tp-route__cp--done' : i === solved ? ' tp-route__cp--now' : ' tp-route__cp--todo');
  return (
    <svg className={`tp-route ${className}`.trim()} viewBox="0 0 400 132" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{labels.aria}</title>
      <polyline className={`tp-route__line${progress ? ' tp-route__line--rest' : ''}`} points={whole} />
      {done && <polyline className="tp-route__line" points={done} />}
      {showEndings &&
        shape.branches!.map((b, i) => (b.line ? <polyline key={i} className="tp-route__line" points={b.line} /> : null))}
      <g className="tp-route__start">
        <circle cx={sx} cy={sy} r="8" />
        <circle cx={sx} cy={sy} r="2.6" />
      </g>
      <text className="tp-route__label" x={shape.startLabel[0]} y={shape.startLabel[1]} textAnchor="middle">
        {labels.start}
      </text>
      {shape.checkpoints.map(([x, y], i) => (
        <g key={i} className={`tp-route__cp${stateOf(i)}`}>
          <circle cx={x} cy={y} r="11" />
          <text x={x} y={y}>
            {i + 1}
          </text>
        </g>
      ))}
      {showEndings && (
        <>
          {shape.branches!.map((b, i) => (
            <circle key={i} className="tp-route__end" cx={b.end[0]} cy={b.end[1]} r="6" />
          ))}
          <text className="tp-route__label" x="352" y="70">
            {labels.endings}
          </text>
        </>
      )}
    </svg>
  );
}
