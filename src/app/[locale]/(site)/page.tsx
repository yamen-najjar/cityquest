import Image from 'next/image';
import { Fragment } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NewsletterForm } from '@/components/NewsletterForm';
import { CreditLine, PhotoCaption, PhotoImage } from '@/components/Photo';
import { RouteSchematic } from '@/components/RouteSchematic';
import { adventures, getAdventure } from '@/content/adventures';
import { cities, getCity } from '@/content/cities';
import { getPhoto } from '@/content/photos';
import { getPresentation, presentedSlugs } from '@/content/presentation';
import type { Adventure } from '@/content/types';
import { isLocale, type Locale } from '@/i18n/config';
import { fmt, getDictionary } from '@/i18n/dictionary';
import { formatPrice } from '@/lib/format';
import { groupBy, joinList, languageList } from '@/lib/lists';
import './home.css';

const heroSlug = 'het-duivelshuis';

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

/** The opening of a story: who speaks, and the lines from chapter 1. Straight from the adventure data. */
function openingOf(a: Adventure, locale: Locale) {
  const first = a.chapters[0];
  const person = a.people.find((p) => p.appears === first?.id);
  const lines = first?.story[locale] ?? [];
  const o = getPresentation(a.slug).opening;
  return { person, quote: lines[o.quote] ?? '', after: lines[o.after] ?? '' };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const credit = t.site.photoCredit;

  const hero = getAdventure(heroSlug);
  if (!hero) notFound();
  const stories = presentedSlugs
    .map((slug) => getAdventure(slug))
    .filter((a): a is Adventure => !!a);

  // Everything below is computed from the adventures, so a changed duration or price shows up here too.
  const chapterCount = Math.min(...adventures.map((a) => a.chapters.length));
  const minutesMin = Math.min(...adventures.map((a) => a.durationMinutes.min));
  const minutesMax = Math.max(...adventures.map((a) => a.durationMinutes.max));
  const teamMin = Math.min(...adventures.map((a) => a.teamSize.min));
  const teamMax = Math.max(...adventures.map((a) => a.teamSize.max));
  const team = fmt(t.units.people, { min: teamMin, max: teamMax });
  const cityNames = cities.filter((c) => adventures.some((a) => a.city === c.slug)).map((c) => c.name[locale]);
  const citiesLine = cityNames.length === 2 ? fmt(t.home.citiesOr, { a: cityNames[0] ?? '', b: cityNames[1] ?? '' }) : joinList(cityNames, locale, 'disjunction');
  const darkest = adventures.reduce((a, b) => (b.minAge > a.minAge ? b : a));
  const heroOpening = openingOf(hero, locale);
  const heroPhoto = getPhoto(getPresentation(hero.slug).photo);

  const priceGroups = [...groupBy(adventures, (a) => a.priceCents)].map(([cents, list]) =>
    fmt(t.home.costGroup, { price: formatPrice(cents, locale), titles: joinList(list.map((a) => a.title[locale]), locale) }),
  );
  const languageGroups = [...groupBy(adventures, (a) => a.languages.join())].map(([, list]) =>
    fmt(t.home.languagesGroup, { titles: joinList(list.map((a) => a.title[locale]), locale), languages: languageList(list[0]?.languages ?? [], locale) }),
  );
  const modeNames = { junior: t.game.modes.junior.name, relaxed: t.game.modes.relaxed.name, classic: t.game.modes.classic.name, expert: t.game.modes.expert.name };
  const faqVars = { cities: citiesLine, team, ...modeNames, title: darkest.title[locale], age: darkest.minAge };
  const practical: [string, string][] = [
    [t.home.bringLabel, t.home.bring],
    [t.home.whoLabel, fmt(t.home.who, { team })],
    [t.home.safetyLabel, t.home.safety],
    [t.home.costLabel, fmt(t.home.cost, { prices: priceGroups.join('; '), max: teamMax })],
    [t.home.languagesLabel, languageGroups.join(' ')],
  ];

  const layouts = ['full', 'left', 'right'] as const;
  const positions: Record<string, string> = { 'lost-manuscript': '22% 78%', 'neckar-ring': '34% 50%' };

  return (
    <>
      {/* Hero: the first message */}
      <section className="hm-he" aria-labelledby="hero-title">
        <PhotoImage id={getPresentation(hero.slug).photo} locale={locale} sizes="100vw" priority className="hm-he__img" />
        <div className="hm-he__inner tp-wrap">
          <div>
            <p className="hm-dateline">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5" fill="none" stroke="#f29f3a" strokeWidth="2" />
                <circle cx="7" cy="7" r="2" fill="#f29f3a" />
              </svg>
              <span>{heroPhoto.place[locale]}</span>
              <span className="hm-dateline__sep" aria-hidden="true">·</span>
              <span>{t.home.heroWhen}</span>
            </p>
            <h1 id="hero-title" className="hm-hero-title">
              {t.home.heroTitle}
            </h1>
            <p className="hm-hero-sub">{fmt(t.home.heroSub, { n: chapterCount, cities: citiesLine, min: minutesMin, max: minutesMax })}</p>
            <div className="hm-hero-actions">
              <Link className="tp-btn" href={`/${locale}/play/${hero.slug}`}>
                {t.adventure.play}
                <Arrow />
              </Link>
              <a className="tp-textlink" href="#verhalen">
                {t.home.heroStories}
              </a>
            </div>
          </div>
          {heroOpening.person && (
            <aside className="hm-he__msg" aria-label={fmt(t.home.messageAria, { name: heroOpening.person.name[locale] })}>
              <p className="hm-he__from">
                <span className="hm-he__avatar" aria-hidden="true">{initials(heroOpening.person.name[locale])}</span>
                <span className="hm-he__who">
                  <strong>{heroOpening.person.name[locale]}</strong>
                  <span>{heroOpening.person.role[locale]} · {t.adventure.firstMessage}</span>
                </span>
              </p>
              <p className="hm-he__body">{heroOpening.quote}</p>
              <p className="hm-he__under">{heroOpening.after}</p>
            </aside>
          )}
        </div>
        <CreditLine id={getPresentation(hero.slug).photo} template={credit} className="hm-he__credit" />
      </section>

      {/* The cases, as an index */}
      <section className="hm-contents tp-wrap" id="verhalen" aria-labelledby="verhalen-title">
        <div>
          <h2 id="verhalen-title">{t.home.storiesTitle}</h2>
          <p className="hm-contents__lead">{fmt(t.home.storiesLead, { n: chapterCount })}</p>
          <form action={`/${locale}/adventures`} method="get" role="search" className="hm-search">
            <label htmlFor="home-search">{t.home.searchLabel}</label>
            <div>
              <input id="home-search" name="q" type="search" placeholder={t.home.searchPlaceholder} />
              <button type="submit">{t.home.searchButton}</button>
            </div>
          </form>
        </div>
        <div>
          <ul className="hm-index">
            {stories.map((a, i) => (
              <li key={a.slug}>
                <a href={`#${a.slug}`}>
                  <span className={`hm-index__city${i > 0 && stories[i - 1]?.city === a.city ? ' hm-is-repeat' : ''}`}>{getCity(a.city)?.name[locale]}</span>
                  <span className="hm-index__title">{a.title[locale]}</span>
                  <span className="hm-index__meta">{fmt(t.units.minutes, { min: a.durationMinutes.min, max: a.durationMinutes.max })}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="hm-contents__note">{t.cities.moreSoon}</p>
        </div>
      </section>

      {/* The cases, one after the other */}
      <div className="hm-stories">
        {stories.map((a, i) => {
          const layout = layouts[i] ?? 'left';
          const p = getPresentation(a.slug);
          const city = getCity(a.city)?.name[locale] ?? '';
          const href = `/${locale}/adventures/${a.slug}`;
          const endings = a.ending.decision.choices.length;
          const facts = [
            city,
            fmt(t.units.minutes, { min: a.durationMinutes.min, max: a.durationMinutes.max }),
            fmt(t.units.km, { n: a.distanceKm }),
            fmt(t.units.age, { n: a.minAge }),
            ...(a.difficulty === 'hard' ? [t.difficulty[a.difficulty]] : []),
            `${formatPrice(a.priceCents, locale)} ${t.card.perTeam}`,
          ];
          const factsLine = (
            <p className="tp-facts hm-facts">
              {facts.map((f, k) => (
                <Fragment key={k}>
                  {k > 0 && <span className="tp-sep" aria-hidden="true">&nbsp;· </span>}
                  <span>{f}</span>
                </Fragment>
              ))}
            </p>
          );
          const route = (
            <RouteSchematic
              slug={a.slug}
              endings={endings}
              className={layout === 'full' ? 'tp-route--wide' : ''}
              labels={{
                aria: endings > 2 ? fmt(t.home.routeAriaEndings, { n: a.chapters.length, e: endings }) : fmt(t.home.routeAria, { n: a.chapters.length }),
                start: t.home.routeStart,
                endings: fmt(t.home.endings, { n: endings }),
              }}
            />
          );
          const more = (
            <p className="hm-story__more">
              <Link className="tp-textlink" href={href}>
                {a.isDemo ? t.home.readCaseDemo : t.home.readCase}
                <Arrow />
              </Link>
            </p>
          );
          const languages = <p className="hm-story__lang">{fmt(t.home.languagesLine, { languages: languageList(a.languages, locale) })}</p>;
          const bandPhoto = p.homePhoto ?? p.photo;
          const caption = <PhotoCaption id={bandPhoto} locale={locale} template={credit} />;

          if (layout === 'full') {
            return (
              <article key={a.slug} className="hm-story hm-story--full" id={a.slug} aria-labelledby={`${a.slug}-title`}>
                <figure className="hm-story__photo">
                  <div className="hm-story__frame">
                    <PhotoImage id={bandPhoto} locale={locale} sizes="100vw" />
                  </div>
                  {caption}
                </figure>
                <div className="hm-story__body tp-wrap">
                  <div className="hm-story__head">
                    <p className="hm-story__place">{city} · {p.startLine[locale]}</p>
                    <h3 className="hm-story__title" id={`${a.slug}-title`}>
                      <Link href={href}>{a.title[locale]}</Link>
                    </h3>
                  </div>
                  <div className="hm-story__intro">
                    <p className="hm-story__hook">{a.tagline[locale]}</p>
                    <p className="hm-story__text">{a.description[locale]}</p>
                  </div>
                  {route}
                  <div className="hm-story__meta">
                    {factsLine}
                    {languages}
                    {more}
                  </div>
                </div>
              </article>
            );
          }
          return (
            <article key={a.slug} className={`hm-story hm-story--side hm-story--${layout}`} id={a.slug} aria-labelledby={`${a.slug}-title`}>
              <figure className="hm-story__photo">
                <PhotoImage id={p.photo} locale={locale} sizes="(max-width: 900px) 100vw, 60vw" style={{ objectPosition: positions[a.slug] }} />
                {caption}
              </figure>
              <div className="hm-story__body">
                <p className="hm-story__place">{city} · {p.startLine[locale]}</p>
                <h3 className="hm-story__title" id={`${a.slug}-title`}>
                  <Link href={href}>{a.title[locale]}</Link>
                </h3>
                <p className="hm-story__hook">{a.tagline[locale]}</p>
                <p className="hm-story__text">{a.description[locale]}</p>
                {route}
                {factsLine}
                {languages}
                {more}
              </div>
            </article>
          );
        })}
      </div>

      {/* What happens on the street */}
      <section className="hm-play" id="spelen" aria-labelledby="spelen-title">
        <div className="tp-wrap hm-play__grid">
          <div className="hm-play__phones">
            <figure className="hm-phone">
              <div className="hm-phone__frame">
                <div className="hm-phone__screen">
                  <Image src={`/photos/game/duivelshuis-chapter-${locale}.jpg`} width={600} height={1300} alt={t.home.phoneChapterAlt} sizes="(max-width: 760px) 45vw, 300px" style={{ objectPosition: 'top' }} />
                </div>
              </div>
              <figcaption>{fmt(t.home.phoneChapterCaption, { title: hero.title[locale], line: hero.chapters[0]?.story[locale][0] ?? '' })}</figcaption>
            </figure>
            <figure className="hm-phone hm-phone--low">
              <div className="hm-phone__frame">
                <div className="hm-phone__screen">
                  <Image src={`/photos/game/duivelshuis-phone-${locale}.jpg`} width={600} height={1300} alt={t.home.phoneGameAlt} sizes="(max-width: 760px) 45vw, 300px" style={{ objectPosition: 'bottom' }} />
                </div>
              </div>
              <figcaption>{t.home.phoneGameCaption}</figcaption>
            </figure>
          </div>
          <div className="hm-play__text">
            <h2 id="spelen-title">{t.home.playTitle}</h2>
            <div className="hm-play__steps">
              {t.home.playSteps.map((s) => (
                <p key={s}>{s}</p>
              ))}
            </div>
            <div className="hm-play__cta">
              <Link className="tp-btn" href={`/${locale}/play/${hero.slug}`}>
                {t.adventure.play}
                <Arrow />
              </Link>
              <p>{fmt(t.home.demoNote, { title: hero.title[locale] })}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical */}
      <section className="hm-practical tp-wrap" id="praktisch" aria-labelledby="praktisch-title">
        <h2 id="praktisch-title">{t.home.practicalTitle}</h2>
        <dl>
          {practical.map(([label, text]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{text}</dd>
            </div>
          ))}
          <div className="hm-is-note">
            <dt>{t.home.statusLabel}</dt>
            <dd>{t.home.status}</dd>
          </div>
        </dl>
      </section>

      {/* Questions */}
      <section className="hm-faq tp-wrap" id="vragen" aria-labelledby="vragen-title">
        <h2 id="vragen-title">{t.home.faqTitle}</h2>
        <dl className="hm-faq__list">
          {t.home.faq.map((f) => (
            <div key={f.q} className="hm-faq__item">
              <dt>{fmt(f.q, faqVars)}</dt>
              <dd>{fmt(f.a, faqVars)}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Newsletter */}
      <section className="hm-news tp-wrap" aria-labelledby="news-title">
        <div>
          <h2 id="news-title">{t.home.newsletterTitle}</h2>
          <p>{t.home.newsletterText}</p>
        </div>
        <NewsletterForm t={t.home} locale={locale} />
      </section>
    </>
  );
}
