import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';

// Shown by the service worker (public/sw.js) for a page that is not on the device while there is no
// reception. A normal static page, so it is cached when the service worker installs.
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).offlinePage.title, robots: { index: false, follow: false } };
}

export default async function OfflinePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <div className="container-cq flex min-h-[50vh] flex-col items-start justify-center py-20">
      <p className="eyebrow" aria-hidden="true">
        ◌
      </p>
      <h1 className="mt-3 font-display text-5xl font-semibold">{t.offlinePage.title}</h1>
      <p className="mt-4 max-w-prose text-ivory-dim">{t.offlinePage.text}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/${locale}/dashboard`} className="btn-gold">
          {t.nav.myAdventures}
        </Link>
        <Link href={`/${locale}`} className="btn-ghost">
          {t.offlinePage.back}
        </Link>
      </div>
    </div>
  );
}
