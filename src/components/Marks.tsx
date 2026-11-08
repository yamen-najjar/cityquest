/** The arrow of a link or button; it mirrors in right-to-left through .tp-arrow. */
export function Arrow({ size = 18 }: { size?: number }) {
  return (
    <svg className="tp-arrow" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

/** The ring-and-dot that marks a place in a dateline, drawn like the start of the route schematic. */
export function PlaceMark() {
  return (
    <svg className="tp-mark" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <circle className="tp-mark__ring" cx="7" cy="7" r="5.5" />
      <circle className="tp-mark__dot" cx="7" cy="7" r="2" />
    </svg>
  );
}
