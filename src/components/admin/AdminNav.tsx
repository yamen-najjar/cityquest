'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/adventures', label: 'Adventures' },
  { href: '/admin/access', label: 'Access & orders' },
  { href: '/admin/players', label: 'Players' },
  { href: '/admin/newsletter', label: 'Newsletter' },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-2 md:flex-col md:px-3">
      {LINKS.map((l) => {
        const active = l.href === '/admin' ? pathname === '/admin' : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? 'page' : undefined}
            className={`whitespace-nowrap rounded-[10px] px-3 py-2.5 text-sm transition ${
              active
                ? 'bg-gold/10 text-gold-soft shadow-[inset_0_0_0_1px_rgba(221,182,106,.25)]'
                : 'text-ivory-dim hover:bg-white/5 hover:text-ivory'
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
