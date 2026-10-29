'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';

export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params?.locale) ? params.locale : 'de';
  const t = getDictionary(locale).notFound;
  return (
    <div className="container-cq flex min-h-[50vh] flex-col items-start justify-center py-20">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">{t.title}</h1>
      <p className="mt-4 text-ivory-dim">{t.text}</p>
      <Link href={`/${locale}`} className="btn-gold mt-8">
        {t.back}
      </Link>
    </div>
  );
}
