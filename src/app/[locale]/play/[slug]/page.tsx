import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GameClient } from '@/components/game/GameClient';
import { adventures, getAdventure } from '@/content/adventures';
import { getCity } from '@/content/cities';
import { isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => adventures.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = getAdventure(slug);
  if (!isLocale(locale) || !a) return {};
  // The game screen is an app, not a landing page: search engines get the adventure page instead.
  return { title: a.title[locale], robots: { index: false, follow: true } };
}

export default async function PlayPage({ params }: Props) {
  const { locale, slug } = await params;
  const a = getAdventure(slug);
  if (!isLocale(locale) || !a) notFound();
  const t = getDictionary(locale);
  // The adventure passed here holds no answers: those stay in content/answers.server.ts.
  return (
    <GameClient
      adventure={a}
      locale={locale}
      cityName={getCity(a.city)?.name[locale] ?? a.city}
      t={t.game}
      achievements={t.achievements}
      languageLabel={t.nav.language}
    />
  );
}
