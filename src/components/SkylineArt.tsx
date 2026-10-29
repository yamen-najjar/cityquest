// The cinematic artwork used for heroes and covers: an imagined old town at night, a hill with a castle
// ruin, a river and an arched bridge. Drawn in SVG so it is sharp on every screen, weighs a few KB and
// needs no photo licence. It is an illustration, not a depiction of a particular view.

type Variant = 'night' | 'dusk';

export function SkylineArt({ variant = 'night', className = '', idPrefix = 'sky' }: { variant?: Variant; className?: string; idPrefix?: string }) {
  const sky = variant === 'dusk' ? ['#1C2E4A', '#3A2E3F', '#6B4A3A'] : ['#060B16', '#0B1324', '#1C2E4A'];
  const id = (s: string) => `${idPrefix}-${s}`;
  // Fixed star field: the same positions on the server and in the browser.
  const stars = Array.from({ length: 46 }, (_, i) => ({
    x: (i * 263) % 1200,
    y: (i * 97) % 260,
    r: i % 5 === 0 ? 1.6 : 0.9,
    o: 0.35 + ((i * 37) % 60) / 100,
  }));
  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset=".6" stopColor={sky[1]} />
          <stop offset="1" stopColor={sky[2]} />
        </linearGradient>
        <radialGradient id={id('moon')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F8E7BE" stopOpacity="1" />
          <stop offset=".25" stopColor="#DDB66A" stopOpacity=".55" />
          <stop offset="1" stopColor="#DDB66A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('river')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#142238" />
          <stop offset="1" stopColor="#060B16" />
        </linearGradient>
        <linearGradient id={id('fade')} x1="0" y1="0" x2="0" y2="1">
          <stop offset=".55" stopColor="#0B1324" stopOpacity="0" />
          <stop offset="1" stopColor="#0B1324" stopOpacity="1" />
        </linearGradient>
      </defs>

      <rect width="1200" height="600" fill={`url(#${id('sky')})`} />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#F8F4EC" opacity={s.o} />
      ))}
      <circle cx="930" cy="120" r="150" fill={`url(#${id('moon')})`} className="animate-shimmer" />
      <circle cx="930" cy="120" r="34" fill="#F6E6C2" />

      {/* Far hills */}
      <path d="M0 330 C 150 260 300 300 420 280 C 560 255 640 300 760 270 C 900 235 1050 250 1200 230 L1200 600 L0 600 Z" fill="#101C30" />

      {/* Castle hill and ruin */}
      <path d="M640 360 C 720 300 800 250 900 240 C 1000 232 1100 260 1200 290 L1200 600 L640 600 Z" fill="#0D1729" />
      <g fill="#0A1222">
        <rect x="820" y="196" width="160" height="70" />
        <rect x="805" y="160" width="34" height="106" />
        <rect x="960" y="150" width="40" height="116" />
        <rect x="880" y="176" width="22" height="90" />
        <path d="M805 160 l17 -18 l17 18 Z" />
        <path d="M960 150 l20 -22 l20 22 Z" />
        <rect x="840" y="210" width="10" height="16" fill="#DDB66A" opacity=".55" />
        <rect x="930" y="214" width="8" height="14" fill="#DDB66A" opacity=".4" />
        <rect x="974" y="176" width="8" height="12" fill="#DDB66A" opacity=".6" />
      </g>

      {/* Old town roofs */}
      <g fill="#091120">
        <path d="M0 400 L0 330 L40 300 L80 330 L80 310 L120 280 L160 310 L160 330 L200 300 L240 330 L260 300 L280 240 L300 300 L330 320 L370 290 L410 320 L410 300 L450 270 L490 300 L520 320 L560 290 L600 320 L640 300 L680 330 L720 310 L720 400 Z" />
      </g>
      <g fill="#DDB66A">
        {[60, 105, 140, 190, 225, 315, 350, 395, 440, 470, 545, 585, 625, 670].map((x, i) => (
          <rect key={x} x={x} y={335 + (i % 3) * 14} width="6" height="9" opacity={0.35 + (i % 4) * 0.12} />
        ))}
      </g>

      {/* River */}
      <rect x="0" y="420" width="1200" height="180" fill={`url(#${id('river')})`} />
      <g stroke="#DDB66A" strokeWidth="2" opacity=".35">
        <line x1="905" y1="450" x2="955" y2="450" />
        <line x1="890" y1="475" x2="970" y2="475" />
        <line x1="915" y1="500" x2="945" y2="500" />
      </g>

      {/* Arched bridge with gate towers */}
      <g fill="#0A1222">
        <rect x="80" y="368" width="560" height="22" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${100 + i * 108} 390 h88 v40 a44 34 0 0 0 -88 0 Z`} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={188 + i * 108} y="390" width="20" height="42" />
        ))}
        <rect x="60" y="300" width="46" height="130" />
        <rect x="112" y="300" width="46" height="130" />
        <path d="M60 300 l23 -34 l23 34 Z" />
        <path d="M112 300 l23 -34 l23 34 Z" />
      </g>
      <g stroke="#DDB66A" strokeWidth="1.2" opacity=".18" fill="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${100 + i * 108} 434 a44 30 0 0 0 88 0`} />
        ))}
      </g>
      {[120, 228, 336, 444, 552].map((x) => (
        <circle key={x} cx={x + 34} cy="360" r="3" fill="#F6D58F" />
      ))}

      <rect width="1200" height="600" fill={`url(#${id('fade')})`} />
    </svg>
  );
}
