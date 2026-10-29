// The clockmaker's lock: three symbol equations and the lock face. Always drawn left to right, also in
// Arabic, because it is arithmetic; the labels underneath carry the words for screen readers.

function Sun({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="7" fill="#DDB66A" />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1="0" y1="-10" x2="0" y2="-13" stroke="#DDB66A" strokeWidth="2" strokeLinecap="round" transform={`rotate(${i * 45})`} />
      ))}
    </g>
  );
}

function Moon({ x, y }: { x: number; y: number }) {
  // Crescent: a large outer arc round the left, and a flatter inner arc (radius 13) back to the top.
  return <path transform={`translate(${x} ${y})`} d="M6 -10 A11 11 0 1 0 6 10 A13 13 0 0 1 6 -10 Z" fill="#E8E2D4" />;
}

function Star({ x, y }: { x: number; y: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(1.1)`}
      d="M0 -11 L3 -3.5 L11 -3.5 L4.5 1.5 L7 9.5 L0 4.5 L-7 9.5 L-4.5 1.5 L-11 -3.5 L-3 -3.5 Z"
      fill="#F3D27E"
    />
  );
}

const Sym = { sun: Sun, moon: Moon, star: Star };
type SymName = keyof typeof Sym;

const rows: { a: SymName; op: string; b: SymName; result: string }[] = [
  { a: 'sun', op: '+', b: 'sun', result: '6' },
  { a: 'moon', op: '−', b: 'sun', result: '4' },
  { a: 'star', op: '×', b: 'sun', result: '12' },
];
const lock: SymName[] = ['moon', 'sun', 'star', 'moon'];

export function SymbolEquations({ labels }: { labels: { sun: string; moon: string; star: string; lock: string } }) {
  const opWord: Record<string, string> = { '+': '+', '−': '−', '×': '×' };
  return (
    <div dir="ltr" className="rounded-2xl border border-gold/25 bg-navy p-4">
      <svg viewBox="0 0 220 130" className="mx-auto block h-auto w-full max-w-sm" aria-hidden="true">
        {rows.map((r, i) => {
          const y = 22 + i * 36;
          const A = Sym[r.a];
          const B = Sym[r.b];
          return (
            <g key={i}>
              <A x={30} y={y} />
              <text x="58" y={y + 6} fill="#F8F4EC" fontSize="18" textAnchor="middle">{r.op}</text>
              <B x={86} y={y} />
              <text x="116" y={y + 6} fill="#F8F4EC" fontSize="18" textAnchor="middle">=</text>
              <text x="146" y={y + 7} fill="#DDB66A" fontSize="20" fontWeight="700" textAnchor="middle">{r.result}</text>
            </g>
          );
        })}
      </svg>
      <ul className="sr-only">
        {rows.map((r, i) => (
          <li key={i}>
            {labels[r.a]} {opWord[r.op]} {labels[r.b]} = {r.result}
          </li>
        ))}
      </ul>
      <div className="mt-3 border-t border-white/10 pt-3 text-center">
        <p className="text-xs text-ivory-mute">{labels.lock}</p>
        <div className="mt-2 flex justify-center gap-2" aria-hidden="true">
          {lock.map((s, i) => {
            const S = Sym[s];
            return (
              <svg key={i} viewBox="-16 -16 32 32" className="h-12 w-12 rounded-lg border border-white/15 bg-navy-800">
                <S x={0} y={0} />
              </svg>
            );
          })}
        </div>
        <p className="sr-only">{lock.map((s) => labels[s]).join(', ')}</p>
      </div>
    </div>
  );
}
