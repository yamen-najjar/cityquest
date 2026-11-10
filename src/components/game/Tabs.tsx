'use client';

import type { ReactNode } from 'react';

export const tabId = (prefix: string, id: string) => `${prefix}-tab-${id}`;
export const panelId = (prefix: string) => `${prefix}-panel`;

/**
 * A row of tabs with the keyboard behaviour of the ARIA tabs pattern: one tab stop for the whole row,
 * the arrow keys (mirrored in right-to-left pages) and Home / End move between tabs and select them.
 * Pair it with a `role="tabpanel"` that has `id={panelId(prefix)}` and `aria-labelledby={tabId(prefix, value)}`.
 */
export function TabList<T extends string>({
  prefix,
  labelledBy,
  tabs,
  value,
  onChange,
  className,
  tabClassName,
}: {
  prefix: string;
  /** Id of the element that names the row (the dialog's title). */
  labelledBy: string;
  tabs: { id: T; label: ReactNode }[];
  value: T;
  onChange: (id: T) => void;
  className: string;
  tabClassName: (selected: boolean) => string;
}) {
  const move = (from: number, to: number) => {
    const target = tabs[(to + tabs.length) % tabs.length]!;
    onChange(target.id);
    document.getElementById(tabId(prefix, target.id))?.focus();
  };
  return (
    <div role="tablist" aria-labelledby={labelledBy} className={className}>
      {tabs.map((x, i) => {
        const selected = value === x.id;
        return (
          <button
            key={x.id}
            id={tabId(prefix, x.id)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId(prefix)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(x.id)}
            onKeyDown={(e) => {
              const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
              const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
              const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
              if (e.key === forward) move(i, i + 1);
              else if (e.key === backward) move(i, i - 1);
              else if (e.key === 'Home') move(i, 0);
              else if (e.key === 'End') move(i, tabs.length - 1);
              else return;
              e.preventDefault();
            }}
            className={tabClassName(selected)}
          >
            {x.label}
          </button>
        );
      })}
    </div>
  );
}
