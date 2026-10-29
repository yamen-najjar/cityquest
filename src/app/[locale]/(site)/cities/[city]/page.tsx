import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdventureCard } from '@/components/AdventureCard';
import { SkylineArt } from '@/components/SkylineArt';
import { adventuresIn } from '@/content/adventures';
import { cities, getCity } from '@/content/cities';
import { isLocale, locales } from '@/i18n/config';
import { fmt, getDictionary } from '@/i18n/dictionary';
import { alternates } from '@/lib/site';

type Props = { params: Promise<{ locale: string; city: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => cities.map((c) => ({ locale, city: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city: slug } = await params;
  const city = getCity(slug);
  if (!isLocale(locale) || !city) return {};
  const t = getDictionary(locale);
  return {
    title: fmt(t.cities.adventuresIn, { city: city.name[locale] }),
    description: city.intro[locale],
    alternates: alternates(locale, `/cities/${slug}`),
  };
}

export default async function CityPage({ params }: Props) {
  const { locale, city: slug } = await params;
  const city = getCity(slug);
  if (!isLocale(locale) || !city) notFound();
  const t = getDictionary(locale);
  const advs = adventuresIn(city.slug);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <SkylineArt idPrefix="city-hero" className="absolute inset-0 -z-10 h-full w-full" />
        <div className="container-cq py-24">
          <Link href={`/${locale}/cities`} className="text-sm text-ivory-dim hover:text-gold">
            <span aria-hidden="true" className="inline-block rtl:rotate-180">←</span> {t.cities.back}
          </Link>
          <p className="eyebrow mt-6">{city.region[locale]}</p>
          <h1 className="mt-2 font-display text-5xl font-semibold sm:text-6xl">{city.name[locale]}</h1>
          <p className="mt-4 max-w-xl text-ivory-dim">{city.intro[locale]}</p>
        </div>
      </section>
      <section className="container-cq mt-10">
        <h2 className="font-display text-3xl font-semibold">{fmt(t.cities.adventuresIn, { city: city.name[locale] })}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advs.map((a) => (
            <AdventureCard key={a.slug} adventure={a} locale={locale} dict={t} />
          ))}
        </div>
      </section>
    </>
  );
}
