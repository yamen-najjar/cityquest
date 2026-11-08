import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CitySchematic } from '@/components/CitySchematic';
import { Arrow } from '@/components/Marks';
import { PhotoCaption, PhotoImage } from '@/components/Photo';
import { adventuresIn } from '@/content/adventures';
import { cities } from '@/content/cities';
import { getCityPresentation } from '@/content/presentation';
import { isLocale } from '@/i18n/config';
import { fmt, getDictionary } from '@/i18n/dictionary';
import { normalizeAnswer } from '@/lib/engine/normalize';
import { formatNumber } from '@/lib/format';
import { alternates } from '@/lib/site';
import './cities.css';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string; available?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.cities.title, description: t.cities.intro, alternates: alternates(locale, '/cities') };
}

export default async function CitiesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { q = '', available } = await searchParams;
  const needle = normalizeAnswer(q);
  const list = cities.filter(
    (c) =>
      (!needle || Object.values(c.name).some((n) => normalizeAnswer(n).includes(needle))) &&
      (available !== '1' || c.status === 'available'),
  );
  const credit = t.site.photoCredit;

  return (
    <div className="tp-wrap">
      <section className="ct-open" aria-labelledby="h1">
        <h1 className="ct-h1" id="h1">
          {t.cities.title}
        </h1>
        <p className="ct-lead">{t.cities.intro}</p>
        <form method="get" role="search" className="ct-search">
          <div className="ct-search__row">
            <label htmlFor="city-q" className="ct-search__label">
              {t.cities.searchLabel}
            </label>
            <input id="city-q" name="q" type="search" defaultValue={q} placeholder={t.cities.searchPlaceholder} autoComplete="off" />
          </div>
          <label className="ct-check">
            <input type="checkbox" name="available" value="1" defaultChecked={available === '1'} />
            {t.cities.availableOnly}
          </label>
          <button type="submit">{t.home.searchButton}</button>
        </form>
      </section>

      <div className="ct-grid">
        <aside className="ct-aside" aria-labelledby="schema-title">
          <h2 id="schema-title">{t.cities.schemaTitle}</h2>
          <CitySchematic cities={cities} locale={locale} t={t.cities} hrefFor={(slug) => `/${locale}/cities/${slug}`} />
          <p className="cs-note">{t.cities.schemaNote}</p>
        </aside>

        <div>
          {list.length === 0 && <p className="ct-none">{t.cities.noResults}</p>}
          {list.map((c, index) => {
            const advs = adventuresIn(c.slug);
            const pres = getCityPresentation(c.slug);
            const href = `/${locale}/cities/${c.slug}`;
            const status = [
              c.pilot ? t.cities.pilot : null,
              c.status === 'available' ? t.cities.available : t.cities.comingSoon,
              fmt(advs.length === 1 ? t.cities.adventureCountOne : t.cities.adventureCount, { n: advs.length }),
            ]
              .filter(Boolean)
              .join(' · ');
            return (
              <article key={c.slug} className="ct-city" id={c.slug} aria-labelledby={`city-${c.slug}`}>
                <figure className="ct-fig ct-band">
                  <div className="ct-city__photo">
                    <PhotoImage id={pres.photo} locale={locale} sizes="(max-width: 960px) 100vw, 58vw" priority={index === 0} />
                  </div>
                  <PhotoCaption id={pres.photo} locale={locale} template={credit} />
                </figure>
                <div>
                  <p className="ct-dateline">
                    <b>{t.cities.countries[c.country]}</b> <span className="tp-sep" aria-hidden="true">·</span> {c.region[locale].split(/[,،]/)[0]?.trim()}{' '}
                    <span className="tp-sep" aria-hidden="true">·</span>{' '}
                    {fmt(t.cities.coordinates, { lat: formatNumber(c.center.lat, locale, 4), lng: formatNumber(c.center.lng, locale, 4) })}
                  </p>
                  <h2 id={`city-${c.slug}`}>
                    <Link href={href}>{c.name[locale]}</Link>
                  </h2>
                  <p className="ct-city__status">{status}</p>
                  <p className="ct-city__intro">{c.intro[locale]}</p>
                  <ul className="ct-lines">
                    {advs.map((a) => (
                      <li key={a.slug}>
                        <Link href={`/${locale}/adventures/${a.slug}`}>
                          <span className="ct-lines__t">{a.title[locale]}</span>
                          <span className="ct-lines__m">
                            {[t.themes[a.theme], fmt(t.units.minutes, { min: a.durationMinutes.min, max: a.durationMinutes.max }), fmt(t.units.km, { n: a.distanceKm }), fmt(t.units.age, { n: a.minAge })].map((m, i) => (
                              <span key={i}>
                                {i > 0 && <span className="tp-sep" aria-hidden="true"> · </span>}
                                {m}
                              </span>
                            ))}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="ct-more">
                    <Link className="tp-textlink" href={href}>
                      {fmt(t.cities.view, { city: c.name[locale] })}
                      <Arrow />
                    </Link>
                  </p>
                </div>
              </article>
            );
          })}
          <p className="ct-soon">{t.cities.moreSoon}</p>
        </div>
      </div>
    </div>
  );
}
