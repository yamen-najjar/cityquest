export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  // A lantern inside a keyhole: light that shows the way, and a lock to open.
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="15" fill="#142238" stroke="#DDB66A" strokeWidth="1.2" />
      <path d="M16 6.5a5.5 5.5 0 0 0-3 10.1L11.5 25h9L19 16.6a5.5 5.5 0 0 0-3-10.1Z" fill="#DDB66A" />
      <circle cx="16" cy="12" r="2.2" fill="#0B1324" />
    </svg>
  );
}
