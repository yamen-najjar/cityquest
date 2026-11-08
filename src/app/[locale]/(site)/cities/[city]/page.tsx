import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CitySchematic } from '@/components/CitySchematic';
import { Arrow } from '@/components/Marks';
import { PhotoCaption, PhotoImage } from '@/components/Photo';
import { adventuresIn } from '@/content/adventures';
import { cities, getCity } from '@/content/cities';
import { getCityPresentation, getPresentation } from '@/content/presentation';
import { isLocale, locales } from '@/i18n/config';
import { fmt, getDictionary } from '@/i18n/dictionary';
import { formatNumber, formatPrice } from '@/lib/format';
import { joinList, languageList } from '@/lib/lists';
import { alternates } from '@/lib/site';
import '../cities.css';
import './city.css';

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
  const credit = t.site.photoCredit;
  const advs = adventuresIn(city.slug);
  const pres = getCityPresentation(city.slug);
  const themes = [...new Set(advs.map((a) => a.theme))].map((th) => t.themes[th]);
  const facts = [
    city.status === 'available' ? t.cities.available : t.cities.comingSoon,
    fmt(advs.length === 1 ? t.cities.adventureCountOne : t.cities.adventureCount, { n: advs.length }),
    ...(themes.length > 0 ? [`${t.cities.themes}: ${joinList(themes, locale)}`] : []),
  ];
  const adventuresTitle = fmt(t.cities.adventuresIn, { city: city.name[locale] });

  return (
    <div className="tp-wrap">
      <div className="cy">
        <header className="cy__side">
          <Link className="cy-crumb" href={`/${locale}/cities`}>
            <Arrow />
            {t.cities.back}
          </Link>
          <p className="ct-dateline">
            <b>{t.cities.countries[city.country]}</b> <span className="tp-sep" aria-hidden="true">·</span> {city.region[locale].split(/[,،]/)[0]?.trim()}{' '}
            <span className="tp-sep" aria-hidden="true">·</span>{' '}
            {fmt(t.cities.coordinates, { lat: formatNumber(city.center.lat, locale, 4), lng: formatNumber(city.center.lng, locale, 4) })}
          </p>
          <h1 id="h1">{city.name[locale]}</h1>
          <p className="ct-lead cy__lead">{city.intro[locale]}</p>
          <p className="ct-facts cy__facts">
            {facts.map((f, i) => (
              <span key={i}>
                {i > 0 && <span className="tp-sep" aria-hidden="true">&nbsp;· </span>}
                <span>{f}</span>
              </span>
            ))}
          </p>
          <CitySchematic cities={cities} locale={locale} t={t.cities} hrefFor={(s) => `/${locale}/cities/${s}`} currentSlug={city.slug} className="cy__map" />
          <p className="cs-note">{t.cities.schemaNote}</p>
        </header>

        <div className="cy__main">
          <figure className="ct-fig ct-hero cy__hero">
            <PhotoImage id={pres.hero} locale={locale} sizes="(max-width: 960px) 100vw, 58vw" priority />
            <PhotoCaption id={pres.hero} locale={locale} template={credit} />
          </figure>

          <section aria-labelledby="adv">
            <h2 className="cy__h2" id="adv">
              {adventuresTitle}
            </h2>
            {advs.map((a) => {
              const p = getPresentation(a.slug);
              const href = `/${locale}/adventures/${a.slug}`;
              return (
                <article key={a.slug} className="cy-story" aria-labelledby={`t-${a.slug}`}>
                  <figure className="ct-fig ct-places">
                    <PhotoImage id={p.photo} locale={locale} sizes="(max-width: 960px) 100vw, 24vw" />
                    <PhotoCaption id={p.photo} locale={locale} template={credit} />
                  </figure>
                  <div>
                    <p className="ct-dateline">
                      {city.name[locale]} <span className="tp-sep" aria-hidden="true">·</span> {fmt(t.adventure.heroPlace, { theme: t.themes[a.theme], n: a.chapters.length })}
                    </p>
                    <h3 className="cy-story__title" id={`t-${a.slug}`}>
                      <Link href={href}>{a.title[locale]}</Link>
                    </h3>
                    <p className="cy-story__hook">{a.tagline[locale]}</p>
                    <p className="ct-facts cy__facts">
                      {[p.startLine[locale], fmt(t.units.minutes, { min: a.durationMinutes.min, max: a.durationMinutes.max }), fmt(t.units.km, { n: a.distanceKm }), fmt(t.units.age, { n: a.minAge })].map((f, i) => (
                        <span key={i}>
                          {i > 0 && <span className="tp-sep" aria-hidden="true">&nbsp;· </span>}
                          <span>{f}</span>
                        </span>
                      ))}
                    </p>
                    <p className="cy-story__sub">
                      {fmt(t.cities.adventureNote, {
                        price: formatPrice(a.priceCents, locale),
                        max: a.teamSize.max,
                        languages: languageList(a.languages, locale),
                      })}
                    </p>
                    <p className="cy-story__go">
                      <Link className="tp-btn" href={href}>
                        {t.cities.viewAdventure}
                        <Arrow />
                      </Link>
                    </p>
                  </div>
                </article>
              );
            })}
          </section>

          {pres.places.length > 0 && (
            <section aria-labelledby="places">
              <h2 className="sr-only" id="places">
                {pres.realPlaces ? t.cities.placesRoute : t.cities.placesSetting}
              </h2>
              <div className="cy-places">
                {pres.places.map((id) => (
                  <figure key={id} className="ct-fig ct-places">
                    <PhotoImage id={id} locale={locale} sizes="(max-width: 960px) 100vw, 29vw" />
                    <PhotoCaption id={id} locale={locale} template={credit} />
                  </figure>
                ))}
              </div>
            </section>
          )}
          <p className="ct-soon cy__soon">{t.cities.moreSoon}</p>
        </div>
      </div>
    </div>
  );
}
