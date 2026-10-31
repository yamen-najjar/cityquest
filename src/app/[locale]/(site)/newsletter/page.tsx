import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { performNewsletterAction } from './actions';

// The confirm/unsubscribe links open this page; the state change happens only when the button below is
// pressed (a POST), so an email scanner prefetching the link cannot confirm or unsubscribe anyone.
export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ confirm?: string; unsubscribe?: string; done?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: 'Newsletter', robots: { index: false, follow: false } };
}

function Shell({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="container-cq py-20">
      <div className="mx-auto max-w-lg text-center">
        <span className="gold-rule mx-auto block" />
        <h1 className="mt-6 font-display text-3xl font-semibold">{title}</h1>
        <p className="mt-3 text-ivory-dim">{text}</p>
        {children}
      </div>
    </div>
  );
}

export default async function NewsletterPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { confirm, unsubscribe, done } = await searchParams;
  const t = getDictionary(locale).newsletter;

  // After the button POSTs, the action redirects here with the outcome.
  if (done) {
    const map: Record<string, { title: string; text: string }> = {
      confirmed: { title: t.confirmedTitle, text: t.confirmedText },
      already: { title: t.confirmedTitle, text: t.alreadyText },
      unsubscribed: { title: t.unsubscribedTitle, text: t.unsubscribedText },
    };
    const r = map[done] ?? { title: t.invalidTitle, text: t.invalidText };
    return (
      <Shell title={r.title} text={r.text}>
        <Link href={`/${locale}`} className="btn-gold mt-8">
          {t.backHome}
        </Link>
      </Shell>
    );
  }

  // A valid-looking token presents the action button; anything else is an invalid link.
  const mode = confirm && UUID_RE.test(confirm) ? 'confirm' : unsubscribe && UUID_RE.test(unsubscribe) ? 'unsubscribe' : null;
  const token = mode === 'confirm' ? confirm : mode === 'unsubscribe' ? unsubscribe : '';
  if (!mode) {
    return (
      <Shell title={t.invalidTitle} text={t.invalidText}>
        <Link href={`/${locale}`} className="btn-gold mt-8">
          {t.backHome}
        </Link>
      </Shell>
    );
  }

  return (
    <Shell title={mode === 'confirm' ? t.confirmCta : t.unsubscribeCta} text={mode === 'confirm' ? t.confirmPrompt : t.unsubscribePrompt}>
      <form action={performNewsletterAction} className="mt-8">
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="mode" value={mode} />
        <input type="hidden" name="locale" value={locale} />
        <button type="submit" className="btn-gold">
          {mode === 'confirm' ? t.confirmCta : t.unsubscribeCta}
        </button>
      </form>
    </Shell>
  );
}
