import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { confirmByToken, unsubscribeByToken } from '@/lib/newsletter/subscribe.server';

// Confirm/unsubscribe land here from the tokened email links; the action runs server-side on load.
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ confirm?: string; unsubscribe?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.account, robots: { index: false, follow: false } };
}

export default async function NewsletterPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { confirm, unsubscribe } = await searchParams;
  const t = getDictionary(locale).newsletter;

  let title = t.invalidTitle;
  let text = t.invalidText;
  if (confirm) {
    const r = await confirmByToken(confirm);
    if (r === 'ok') {
      title = t.confirmedTitle;
      text = t.confirmedText;
    } else if (r === 'already') {
      title = t.confirmedTitle;
      text = t.alreadyText;
    }
  } else if (unsubscribe) {
    const r = await unsubscribeByToken(unsubscribe);
    if (r === 'ok' || r === 'already') {
      title = t.unsubscribedTitle;
      text = t.unsubscribedText;
    }
  }

  return (
    <div className="container-cq py-20">
      <div className="mx-auto max-w-lg text-center">
        <span className="gold-rule mx-auto block" />
        <h1 className="mt-6 font-display text-3xl font-semibold">{title}</h1>
        <p className="mt-3 text-ivory-dim">{text}</p>
        <Link href={`/${locale}`} className="btn-gold mt-8">
          {t.backHome}
        </Link>
      </div>
    </div>
  );
}
