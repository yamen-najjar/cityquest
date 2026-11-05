'use client';

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" className="btn-gold" onClick={() => window.print()}>
      <span aria-hidden="true">🖨 </span>
      {label}
    </button>
  );
}
