import type { InventoryItem } from '@/content/types';

export function ItemIcon({ icon, className = 'h-8 w-8' }: { icon: InventoryItem['icon']; className?: string }) {
  const common = { fill: 'none', stroke: '#DDB66A', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      {icon === 'letter' && (
        <g {...common}>
          <path d="M6 8h20v16H6z" />
          <path d="M6 8l10 8 10-8" />
          <path d="M20 24l3-4 3 4" />
        </g>
      )}
      {icon === 'key' && (
        <g {...common}>
          <circle cx="10" cy="16" r="5" />
          <path d="M15 16h12M23 16v4M27 16v3" />
        </g>
      )}
      {icon === 'map' && (
        <g {...common}>
          <path d="M5 8l7-3 8 3 7-3v19l-7 3-8-3-7 3z" />
          <path d="M12 5v19M20 8v19" />
          <path d="M22 13l2 2m0-2l-2 2" />
        </g>
      )}
      {icon === 'ring' && (
        <g {...common}>
          <ellipse cx="16" cy="19" rx="8.5" ry="7.5" />
          <ellipse cx="16" cy="19" rx="5.5" ry="4.5" />
          <path d="M13 11.5l3-4 3 4" />
        </g>
      )}
      {icon === 'page' && (
        <g {...common}>
          <path d="M9 4h10l5 5v19H9z" />
          <path d="M19 4v5h5M12 15h8M12 19h8M12 23h5" />
        </g>
      )}
    </svg>
  );
}
