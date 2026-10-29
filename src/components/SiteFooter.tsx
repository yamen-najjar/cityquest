import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { LogoMark } from './Logo';

export const legalDocs = ['impressum', 'privacy', 'terms', 'withdrawal', 'contact'] as const;
export type LegalDoc = (typeof legalDocs)[number];

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="mt-24 border-t border-white/5 bg-[#08101F]">
      <div className="container-cq grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-xl font-semibold" dir="ltr">
              City<span className="text-gold">Quest</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-ivory-dim">{dict.footer.tagline}</p>
          <p className="mt-4 font-display text-lg italic text-gold/90">{dict.meta.slogan}</p>
        </div>
        <div>
          <h2 className="eyebrow">{dict.footer.explore}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="text-ivory-dim hover:text-ivory" href={`/${locale}/cities`}>{dict.nav.cities}</Link></li>
            <li><Link className="text-ivory-dim hover:text-ivory" href={`/${locale}/adventures`}>{dict.nav.adventures}</Link></li>
            <li><Link className="text-ivory-dim hover:text-ivory" href={`/${locale}/dashboard`}>{dict.nav.myAdventures}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="eyebrow">{dict.footer.legal}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {legalDocs.map((d) => (
              <li key={d}>
                <Link className="text-ivory-dim hover:text-ivory" href={`/${locale}/legal/${d}`}>
                  {dict.legal.docs[d].title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <p className="container-cq py-5 text-xs text-ivory-mute">© {new Date().getFullYear()} CityQuest · {dict.footer.status}</p>
      </div>
    </footer>
  );
}
