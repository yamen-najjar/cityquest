import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AutoSubmitForm } from '@/components/AutoSubmit';
import { Arrow, PlaceMark } from '@/components/Marks';
import { PhotoCaption, PhotoImage } from '@/components/Photo';
import { RouteSchematic } from '@/components/RouteSchematic';
import { adventures } from '@/content/adventures';
import { cities, getCity } from '@/content/cities';
import { getPresentation } from '@/content/presentation';
import { isLocale, locales } from '@/i18n/config';
import { fmt, getDictionary } from '@/i18n/dictionary';
import { filterAdventures, filterOptions, parseFilters } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';
import { groupBy, languageList } from '@/lib/lists';
import { alternates } from '@/lib/site';
import './adventures.css';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.catalog.title, description: t.catalog.intro, alternates: alternates(locale, '/adventures') };
}

/** How each band photograph is cropped; never stretched. */
const bandPosition: Record<string, string> = {
  'het-duivelshuis': '50% 40%',
  'lost-manuscript': '50% 45%',
  'neckar-ring': '50% 55%',
};

export default async function CatalogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const f = parseFilters(await searchParams);
  const all = locales.map(getDictionary);
  const list = filterAdventures(adventures, f, (a) => [
    ...Object.values(getCity(a.city)?.name ?? {}),
    ...all.map((d) => d.themes[a.theme]),
  ]);
  const active = Object.values(f).some(Boolean);
  const groups = [...groupBy(list, (a) => a.city)];
  const credit = t.site.photoCredit;

  const select = (name: keyof typeof f, label: string, options: { value: string; label: string }[]) => (
    <label className="av-f" htmlFor={`av-${name}`}>
      {label}
      <select id={`av-${name}`} name={name} defaultValue={f[name] ?? ''}>
        <option value="">{t.catalog.any}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <>
      <header className="av-head tp-wrap">
        <h1>{t.catalog.title}</h1>
        <p className="av-head__lead">{t.catalog.intro}</p>
      </header>

      <div className="av-bar">
        <div className="tp-wrap">
          <AutoSubmitForm action={`/${locale}/adventures`} className="av-filter" role="search" label={t.catalog.filterLabel}>
            <label className="av-f av-f--q" htmlFor="av-q">
              {t.catalog.search}
              <input id="av-q" name="q" type="search" defaultValue={f.q ?? ''} placeholder={t.home.searchPlaceholder} autoComplete="off" />
            </label>
            {select('city', t.catalog.city, cities.map((c) => ({ value: c.slug, label: c.name[locale] })))}
            {select('theme', t.catalog.theme, filterOptions.themes.map((v) => ({ value: v, label: t.themes[v] })))}
            {select('duration', t.catalog.duration, filterOptions.durations.map((v) => ({ value: v, label: t.catalog.durations[v] })))}
            {select('difficulty', t.catalog.difficulty, filterOptions.difficulties.map((v) => ({ value: v, label: t.difficulty[v] })))}
            {select('group', t.catalog.group, filterOptions.groups.map((v) => ({ value: v, label: t.groups[v] })))}
            <div className="av-filter__go">
              <button type="submit">{t.home.searchButton}</button>
              {active && (
                <Link href={`/${locale}/adventures`} className="tp-textlink">
                  {t.catalog.reset}
                </Link>
              )}
            </div>
          </AutoSubmitForm>
        </div>
      </div>
      <div className="tp-wrap">
        <p className="av-count" role="status">
          {fmt(list.length === 1 ? t.catalog.resultsOne : t.catalog.results, { n: list.length })}
        </p>
      </div>

      {list.length === 0 && (
        <div className="tp-wrap">
          <p className="av-empty">
            {t.catalog.noResults}{' '}
            <Link href={`/${locale}/adventures`} className="tp-textlink">
              {t.catalog.reset}
            </Link>
          </p>
        </div>
      )}

      {groups.map(([citySlug, items], groupIndex) => {
        const city = getCity(citySlug);
        const meta = [city?.region[locale], city?.pilot ? t.cities.pilot : null, fmt(items.length === 1 ? t.cities.adventureCountOne : t.cities.adventureCount, { n: items.length })].filter(Boolean).join(' · ');
        return (
          <section key={citySlug} className="av-city" aria-labelledby={`city-${citySlug}`}>
            <div className="tp-wrap av-cityhead">
              <h2 id={`city-${citySlug}`}>{city?.name[locale]}</h2>
              <p>{meta}</p>
            </div>
            <div className="av-stories">
              {items.map((a, itemIndex) => {
                const p = getPresentation(a.slug);
                const photo = p.homePhoto ?? p.photo;
                const href = `/${locale}/adventures/${a.slug}`;
                const endings = a.ending.decision.choices.length;
                const facts: [string, string][] = [
                  [t.card.duration, fmt(t.units.minutes, { min: a.durationMinutes.min, max: a.durationMinutes.max })],
                  [t.card.distance, fmt(t.units.km, { n: a.distanceKm })],
                  [t.card.difficulty, t.difficulty[a.difficulty]],
                  [t.card.team, fmt(t.units.people, { min: a.teamSize.min, max: a.teamSize.max })],
                  [t.card.age, fmt(t.units.age, { n: a.minAge })],
                  [t.catalog.theme, t.themes[a.theme]],
                ];
                return (
                  <article key={a.slug} className="av-story" aria-labelledby={`t-${a.slug}`}>
                    <figure className="av-photo">
                      <div className="av-frame">
                        <PhotoImage id={photo} locale={locale} sizes="100vw" priority={groupIndex === 0 && itemIndex === 0} style={{ objectPosition: bandPosition[a.slug] }} />
                      </div>
                      <PhotoCaption id={photo} locale={locale} template={credit} className="tp-wrap" />
                    </figure>
                    <div className="av-body tp-wrap">
                      <div className="av-info">
                        <p className="av-dateline">
                          <PlaceMark />
                          <span>{city?.name[locale]}</span>
                          <span className="av-dateline__sep" aria-hidden="true">·</span>
                          <span>{p.startLine[locale]}</span>
                        </p>
                        <h3 id={`t-${a.slug}`} className="av-title">
                          <Link href={href}>{a.title[locale]}</Link>
                        </h3>
                        <p className="av-hook">{a.tagline[locale]}</p>
                        <p className="av-more">
                          <Link className="tp-textlink" href={href}>
                            {a.isDemo ? t.catalog.readCase : t.home.readCase}
                            <Arrow />
                          </Link>
                        </p>
                      </div>
                      <div className="av-facts">
                        <dl>
                          {facts.map(([label, value]) => (
                            <div key={label}>
                              <dt>{label}</dt>
                              <dd>{value}</dd>
                            </div>
                          ))}
                          <div className="av-wide">
                            <dt>{t.card.languages}</dt>
                            <dd>{languageList(a.languages, locale)}</dd>
                          </div>
                          <div className="av-wide av-priceRow">
                            <dt>{t.adventure.price}</dt>
                            <dd>
                              <strong>{formatPrice(a.priceCents, locale)}</strong> {t.card.perTeam}
                              {a.isDemo && <span className="av-demo">{t.card.demo}</span>}
                            </dd>
                          </div>
                        </dl>
                        <RouteSchematic
                          slug={a.slug}
                          endings={endings}
                          labels={{
                            aria: endings > 2 ? fmt(t.home.routeAriaEndings, { n: a.chapters.length, e: endings }) : fmt(t.home.routeAria, { n: a.chapters.length }),
                            start: t.home.routeStart,
                            endings: fmt(t.home.endings, { n: endings }),
                          }}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="tp-wrap">
        <p className="av-more-cities">{t.cities.moreSoon}</p>
      </div>
    </>
  );
}
