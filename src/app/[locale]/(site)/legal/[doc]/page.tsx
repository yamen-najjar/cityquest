import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { legalDocs, type LegalDoc } from '@/components/SiteFooter';
import { isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';

type Props = { params: Promise<{ locale: string; doc: string }> };

const isDoc = (d: string): d is LegalDoc => (legalDocs as readonly string[]).includes(d);

export function generateStaticParams() {
  return locales.flatMap((locale) => legalDocs.map((doc) => ({ locale, doc })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, doc } = await params;
  if (!isLocale(locale) || !isDoc(doc)) return {};
  // Placeholders stay out of search results until the real texts exist.
  return { title: getDictionary(locale).legal.docs[doc].title, robots: { index: false } };
}

export default async function LegalPage({ params }: Props) {
  const { locale, doc } = await params;
  if (!isLocale(locale) || !isDoc(doc)) notFound();
  const t = getDictionary(locale).legal;
  return (
    <article className="container-cq max-w-3xl py-14">
      <span className="chip border-gold/40 text-gold">{t.placeholder}</span>
      <h1 className="mt-4 font-display text-4xl font-semibold">{t.docs[doc].title}</h1>
      <p className="mt-6 rounded-2xl border border-gold/30 bg-gold/[0.07] p-5 text-sm text-ivory-dim" role="note">
        {t.notice}
      </p>
      <p className="mt-6 leading-relaxed text-ivory-dim">{t.docs[doc].body}</p>
    </article>
  );
}
