import type { Metadata } from 'next';
import Image from 'next/image';
import { Fragment } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DuivelshuisMap } from '@/components/DuivelshuisMap';
import { PhotoCaption, PhotoImage } from '@/components/Photo';
import { PlayButton } from '@/components/PlayButton';
import { RouteSchematic } from '@/components/RouteSchematic';
import { adventures, getAdventure } from '@/content/adventures';
import { getCity } from '@/content/cities';
import { getPhoto, type PhotoId } from '@/content/photos';
import { getPresentation } from '@/content/presentation';
import { isLocale, localeNames, locales, type Locale } from '@/i18n/config';
import { fmt, getDictionary } from '@/i18n/dictionary';
import { formatPrice, vatShare } from '@/lib/format';
import { joinList, languageList } from '@/lib/lists';
import { alternates, ogLocale, siteUrl } from '@/lib/site';
import './adventure.css';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => adventures.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = getAdventure(slug);
  if (!isLocale(locale) || !a) return {};
  const city = getCity(a.city);
  const title = `${a.title[locale]} – ${city?.name[locale] ?? ''}`;
  return {
    title,
    description: a.description[locale],
    alternates: alternates(locale, `/adventures/${slug}`),
    openGraph: { type: 'website', title, description: a.tagline[locale], locale: ogLocale[locale] },
  };
}

/** How each photograph is cropped where it appears as a "place" figure; never stretched. */
const placePosition: Partial<Record<PhotoId, string>> = {
  'arnhem-eusebius-duivelshuis': '40% 60%',
  'arnhem-duivelshuis-2024': '30% 60%',
  'arnhem-eusebius': '55% 40%',
  'heidelberg-bridge-night': '50% 60%',
  'heidelberg-bridgegate-night': '50% 38%',
  'heidelberg-bridge-night-3': '55% 50%',
  'heidelberg-bridge-night-2': '50% 50%',
};

function Arrow() {
  return (
    <svg className="tp-arrow" width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
      <path d="M1 7h15M10 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  return words.length > 1 ? words.map((w) => w[0]).join('').slice(0, 2) : name.slice(0, 3);
}

const quoteMarks = /^[“„«‘"]/;

export default async function AdventurePage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const a = getAdventure(slug);
  if (!isLocale(rawLocale) || !a) notFound();
  const locale: Locale = rawLocale;
  const t = getDictionary(locale);
  const city = getCity(a.city);
  const p = getPresentation(a.slug);
  const credit = t.site.photoCredit;
  const heroPhoto = getPhoto(p.photo);

  // Structured data describes the experience only. No offer is published while it cannot be bought,
  // and no rating until real reviews exist.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: a.title[locale],
    description: a.description[locale],
    inLanguage: locale,
    url: `${siteUrl}/${locale}/adventures/${a.slug}`,
    touristType: t.themes[a.theme],
    itinerary: { '@type': 'City', name: city?.name[locale] },
  };

  const first = a.chapters[0];
  const person = a.people.find((x) => x.appears === first?.id);
  const openingLines = first?.story[locale] ?? [];
  const quote = openingLines[p.opening.quote] ?? '';
  const after = openingLines[p.opening.after] ?? '';
  const isMessage = quoteMarks.test(quote);
  const duration = fmt(t.units.minutes, { min: a.durationMinutes.min, max: a.durationMinutes.max });
  const distance = fmt(t.units.km, { n: a.distanceKm });
  const team = fmt(t.units.people, { min: a.teamSize.min, max: a.teamSize.max });
  const price = formatPrice(a.priceCents, locale);
  const endings = a.ending.decision.choices.length;
  const modes = joinList([t.game.modes.junior.name, t.game.modes.relaxed.name, t.game.modes.classic.name, t.game.modes.expert.name], locale, 'disjunction');
  const playLabels = { play: t.adventure.play, continue: t.adventure.continue, replay: t.adventure.replay };
  const playHref = `/${locale}/play/${a.slug}`;
  const dossierHref = `/${locale}/adventures/${a.slug}/dossier`;
  const heroFacts = [p.startLine[locale], duration, distance, fmt(t.units.age, { n: a.minAge }), `${price} ${t.card.perTeam}`];
  const placeFigures = ['a', 'b', 'c'] as const;
  const setting = p.settingPhotos.slice(0, 3);

  const factRows: [string, string, string?][] = [
    [t.adventure.factStart, p.start[locale], t.adventure.factStartNote],
    [t.card.duration, duration, t.units.estimate],
    [t.card.distance, distance, t.units.estimate],
    [t.adventure.checkpoints, String(a.chapters.length), t.adventure.factSimulated],
    [t.card.team, `${team}, ${t.adventure.factOneDevice}`],
    [t.card.age, fmt(t.units.age, { n: a.minAge })],
    [t.card.difficulty, t.difficulty[a.difficulty]],
    [t.card.languages, languageList(a.languages, locale)],
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      {/* Hero: the photograph of the place, the title, the way in */}
      <section className="ad-case-hero" aria-labelledby="titel">
        <figure className="ad-case-hero__photo">
          <PhotoImage id={p.photo} locale={locale} sizes="(max-width: 960px) 100vw, 50vw" priority />
        </figure>
        <div className="ad-case-hero__head">
          <nav aria-label={t.adventure.breadcrumb} className="ad-case-hero__place">
            <Link href={`/${locale}/adventures`}>{t.nav.adventures}</Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/${locale}/cities/${a.city}`}>{city?.name[locale]}</Link>
            <span aria-hidden="true"> · </span>
            <span>{fmt(t.adventure.heroPlace, { theme: t.themes[a.theme], n: a.chapters.length })}</span>
          </nav>
          <h1 id="titel">{a.title[locale]}</h1>
          <p className="ad-case-hero__hook">{a.tagline[locale]}</p>
        </div>
        <div className="ad-case-hero__meta">
          <p className="tp-facts ad-facts">
            {heroFacts.map((f, i) => (
              <Fragment key={i}>
                {i > 0 && <span className="tp-sep" aria-hidden="true">&nbsp;· </span>}
                <span>{f}</span>
              </Fragment>
            ))}
          </p>
          <div className="ad-case-hero__actions">
            <PlayButton href={playHref} slug={a.slug} labels={playLabels} className="tp-btn" suffix={<Arrow />} />
            <a className="tp-textlink" href="#dossier">
              {t.adventure.dossierTitle}
            </a>
          </div>
          {a.isDemo && (
            <p className="ad-case-hero__note" role="note">
              {t.adventure.demoNote}
            </p>
          )}
          <PhotoCaption id={p.photo} locale={locale} template={credit} as="p" />
        </div>
      </section>

      {/* The case */}
      <section className="ad-section tp-wrap ad-split" id="zaak" aria-labelledby="zaak-titel">
        <h2 className="ad-h2" id="zaak-titel">
          {t.adventure.caseTitle}
        </h2>
        <div className="ad-case">
          <div className="ad-case__prose">
            <p>{a.description[locale]}</p>
          </div>
          {quote && (
            <figure className="ad-message" aria-label={isMessage && person ? `${person.name[locale]} · ${t.adventure.firstMessage}` : t.adventure.openingScene}>
              {isMessage && person ? (
                <figcaption className="ad-message__from">
                  <span className="ad-message__mono" aria-hidden="true">
                    {initials(person.name[locale])}
                  </span>
                  <span>
                    <span className="ad-message__name">{person.name[locale]}</span>
                    <br />
                    <span className="ad-message__role">
                      {person.role[locale]} · {t.adventure.firstMessage}
                    </span>
                  </span>
                </figcaption>
              ) : (
                <figcaption className="ad-message__from ad-message__from--scene">{t.adventure.openingScene}</figcaption>
              )}
              {isMessage ? (
                <blockquote>
                  <p>{quote}</p>
                </blockquote>
              ) : (
                <p className="ad-narration">{quote}</p>
              )}
              {after && <p className="ad-message__after">{after}</p>}
            </figure>
          )}
        </div>
      </section>

      {/* The route */}
      <section className="ad-section tp-wrap" id="route" aria-labelledby="route-titel">
        <div className="ad-split ad-route-head">
          <h2 className="ad-h2" id="route-titel">
            {t.adventure.routeTitle}
          </h2>
          <p>
            {fmt(t.adventure.routeIntro, { distance, n: a.chapters.length })} {p.realPlaces ? t.adventure.routePlacesReal : t.adventure.routePlacesInvented}
          </p>
        </div>

        <div className="ad-map">
          {p.realPlaces ? (
            <DuivelshuisMap labels={t.adventure.map} checkpoints={a.chapters.length} />
          ) : (
            <RouteSchematic
              slug={a.slug}
              endings={endings}
              className="ad-route-schematic"
              labels={{
                aria: endings > 2 ? fmt(t.home.routeAriaEndings, { n: a.chapters.length, e: endings }) : fmt(t.home.routeAria, { n: a.chapters.length }),
                start: t.home.routeStart,
                endings: fmt(t.home.endings, { n: endings }),
              }}
            />
          )}
          <ul className="ad-legend">
            <li>
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                <circle cx="11" cy="11" r="8" fill="none" stroke="#f29f3a" strokeWidth="3" />
                <circle cx="11" cy="11" r="3" fill="#f29f3a" />
              </svg>
              {t.adventure.legendStart}
            </li>
            <li>
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                <circle cx="11" cy="11" r="9" fill="#f29f3a" />
              </svg>
              {t.adventure.legendCheckpoint}
            </li>
          </ul>
        </div>

        <div className="ad-places">
          {setting.map((id, i) => (
            <figure key={id} className={`ad-places__${placeFigures[i]}`}>
              <PhotoImage id={id} locale={locale} sizes="(max-width: 960px) 100vw, 55vw" style={{ objectPosition: placePosition[id] }} />
              <PhotoCaption id={id} locale={locale} template={credit} />
            </figure>
          ))}
        </div>
      </section>

      {/* At a glance, and the price */}
      <section className="ad-section tp-wrap" id="demo" aria-labelledby="kort-titel">
        <div className="ad-facts-grid">
          <div>
            <h2 className="ad-h2" id="kort-titel">
              {t.adventure.facts}
            </h2>
            <table className="ad-facts-table">
              <tbody>
                {factRows.map(([k, v, note]) => (
                  <tr key={k}>
                    <th scope="row">{k}</th>
                    <td>
                      {v}
                      {note && <small>{note}</small>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div role="group" className="ad-price" aria-label={t.adventure.price}>
            <p className="ad-price__amount">{price}</p>
            <p className="ad-price__per">{fmt(t.adventure.pricePer, { max: a.teamSize.max })}</p>
            <p className="ad-price__note">{fmt(t.adventure.priceNote, { max: a.teamSize.max, vat: formatPrice(vatShare(a.priceCents), locale) }).replace(/(\d) %/, '$1\u00a0%')}</p>
            <p className="ad-price__note">{t.adventure.purchaseLater}</p>
            <PlayButton href={playHref} slug={a.slug} labels={playLabels} className="tp-btn" suffix={<Arrow />} />
            <p className="ad-price__note">{t.adventure.demoFree}</p>
          </div>
        </div>
      </section>

      {/* How to play */}
      <section className="ad-play" id="spelen" aria-labelledby="spelen-titel">
        <div className="tp-wrap ad-play__grid">
          <figure className="ad-phone">
            <div className="ad-phone__frame">
              <div className="ad-phone__screen">
                <Image src={`/photos/game/duivelshuis-start-${locale}.jpg`} width={600} height={1300} alt={t.adventure.phoneAlt} sizes="(max-width: 960px) 300px, 320px" />
              </div>
            </div>
            <figcaption>{t.adventure.phoneCaption}</figcaption>
          </figure>
          <div className="ad-play__text">
            <h2 className="ad-h2" id="spelen-titel">
              {t.adventure.gameplay}
            </h2>
            <p>{fmt(t.adventure.playIntro, { modes, n: a.chapters.length })}</p>
            {p.playLines.map((index, i) => {
              const line = a.overview[locale][index];
              if (!line) return null;
              return (
                <p key={index} className={i === p.playLines.length - 1 ? 'ad-play__end' : undefined}>
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="ad-section tp-wrap ad-split" id="regels" aria-labelledby="regels-titel">
        <h2 className="ad-h2" id="regels-titel">
          {t.adventure.instructions}
        </h2>
        <ul className="ad-rules">
          {a.instructions[locale].map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      {/* Meeting point and accessibility */}
      <section className="ad-section tp-wrap ad-where">
        <div id="verzamelpunt">
          <h2 className="ad-h2">{t.adventure.meetingPoint}</h2>
          <div className="ad-coords">
            <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
              <circle cx="22" cy="22" r="16" fill="none" stroke="#f29f3a" strokeWidth="4" />
              <circle cx="22" cy="22" r="6" fill="#f29f3a" />
            </svg>
            <div>
              <p className="ad-coords__place">{(p.coordinates?.place ?? p.start)[locale]}</p>
              {p.coordinates && (
                <p className="ad-coords__num" dir="ltr">
                  {p.coordinates.lat.toFixed(4)}° N, {p.coordinates.lng.toFixed(4)}° E
                </p>
              )}
            </div>
          </div>
          <p className="tp-muted">{a.meetingPoint[locale]}</p>
        </div>
        <div className="ad-access" id="toegankelijkheid">
          <h2 className="ad-h2">{t.adventure.accessibility}</h2>
          <p>{a.accessibility[locale]}</p>
        </div>
      </section>

      {/* Questions */}
      <section className="ad-section tp-wrap ad-faq" id="vragen" aria-labelledby="vragen-titel">
        <h2 className="ad-h2" id="vragen-titel">
          {t.adventure.faq}
        </h2>
        <dl className="ad-faq__list">
          {a.faq.map((f) => (
            <div key={f.q.en} className="ad-faq__item">
              <dt>{f.q[locale]}</dt>
              <dd>{f.a[locale]}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* The case dossier */}
      <section className="ad-section tp-wrap ad-dossier" id="dossier" aria-labelledby="dossier-titel">
        <h2 className="ad-h2" id="dossier-titel">
          {t.adventure.dossierTitle}
        </h2>
        <div className="ad-dossier__text">
          <p>{t.adventure.dossierText}</p>
          <Link href={dossierHref} className="tp-btn tp-btn--quiet">
            <svg width="20" height="18" viewBox="0 0 20 18" aria-hidden="true">
              <path d="M5 6V1h10v5M5 13H2V6h16v7h-3M5 10h10v7H5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            {t.adventure.dossier}
          </Link>
        </div>
      </section>
    </>
  );
}
