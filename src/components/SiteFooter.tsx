import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { RouteMark } from './Logo';

export const legalDocs = ['impressum', 'privacy', 'terms', 'withdrawal', 'contact'] as const;
export type LegalDoc = (typeof legalDocs)[number];

/**
 * A legal document's title. Outside German pages it ends in the German legal term in brackets
 * ("Privacy policy (Datenschutzerklärung)"): that part is marked as German so screen readers pronounce it
 * right, and as left to right so the brackets stay in place in Arabic.
 */
export function LegalTitle({ title }: { title: string }) {
  const match = /^(.*?) \(([^()]+)\)$/.exec(title);
  if (!match) return <>{title}</>;
  return (
    <>
      {match[1]} (<span lang="de" dir="ltr">{match[2]}</span>)
    </>
  );
}

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="tp-footer">
      <div className="tp-wrap">
        <div className="tp-footer__top">
          <Link href={`/${locale}`} className="tp-brand" aria-label={`CityQuest – ${dict.nav.home}`}>
            <RouteMark />
            <span dir="ltr">CityQuest</span>
          </Link>
          <p>{dict.footer.tagline}</p>
          <nav aria-label={dict.footer.explore}>
            <ul className="tp-footer__links">
              <li><Link href={`/${locale}/cities`}>{dict.nav.cities}</Link></li>
              <li><Link href={`/${locale}/adventures`}>{dict.nav.adventures}</Link></li>
              <li><Link href={`/${locale}/dashboard`}>{dict.nav.myAdventures}</Link></li>
            </ul>
          </nav>
        </div>
        <div className="tp-footer__fine">
          <nav aria-label={dict.footer.legal}>
            <ul className="tp-footer__links">
              {legalDocs.map((d) => (
                <li key={d}>
                  <Link href={`/${locale}/legal/${d}`}><LegalTitle title={dict.legal.docs[d].title} /></Link>
                </li>
              ))}
            </ul>
          </nav>
          <p>{dict.footer.photos}</p>
          <p>© {new Date().getFullYear()} CityQuest · {dict.footer.status}</p>
        </div>
      </div>
    </footer>
  );
}
