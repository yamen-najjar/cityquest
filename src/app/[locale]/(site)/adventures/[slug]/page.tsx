import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PlayButton } from '@/components/PlayButton';
import { SkylineArt } from '@/components/SkylineArt';
import { adventures, getAdventure } from '@/content/adventures';
import { getCity } from '@/content/cities';
import { isLocale, localeNames, locales } from '@/i18n/config';
import { fmt, getDictionary } from '@/i18n/dictionary';
import { formatPrice, vatShare } from '@/lib/format';
import { alternates, ogLocale, siteUrl } from '@/lib/site';

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

export default async function AdventurePage({ params }: Props) {
  const { locale, slug } = await params;
  const a = getAdventure(slug);
  if (!isLocale(locale) || !a) notFound();
  const t = getDictionary(locale);
  const city = getCity(a.city);

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

  const facts: [string, string][] = [
    [t.card.duration, `${fmt(t.units.minutes, { min: a.durationMinutes.min, max: a.durationMinutes.max })} (${t.units.estimate})`],
    [t.card.distance, `${fmt(t.units.km, { n: a.distanceKm })} (${t.units.estimate})`],
    [t.adventure.checkpoints, fmt(t.adventure.checkpointsValue, { n: a.chapters.length })],
    [t.card.team, fmt(t.units.people, { min: a.teamSize.min, max: a.teamSize.max })],
    [t.card.age, fmt(t.units.age, { n: a.minAge })],
    [t.card.difficulty, t.difficulty[a.difficulty]],
    [t.card.languages, a.languages.map((l) => localeNames[l]).join(', ')],
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <section className="relative isolate overflow-hidden">
        <SkylineArt idPrefix="adv-hero" variant={a.art ?? 'dusk'} className="absolute inset-0 -z-10 h-full w-full" />
        <div className="container-cq py-20 sm:py-28">
          <nav aria-label={t.adventure.breadcrumb} className="text-sm text-ivory-dim">
            <Link href={`/${locale}/adventures`} className="hover:text-gold">
              {t.nav.adventures}
            </Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/${locale}/cities/${a.city}`} className="hover:text-gold">
              {city?.name[locale]}
            </Link>
          </nav>
          <div className="mt-6 flex flex-wrap gap-2">
            {a.isDemo && <span className="chip border-gold/40 bg-navy/70 text-gold">{t.card.demo}</span>}
            <span className="chip bg-navy/70">{t.themes[a.theme]}</span>
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight sm:text-6xl">{a.title[locale]}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ivory-dim">{a.tagline[locale]}</p>
        </div>
      </section>

      <div className="container-cq grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          {a.isDemo && (
            <p className="rounded-2xl border border-gold/30 bg-gold/[0.07] p-5 text-sm text-ivory-dim" role="note">
              {t.adventure.demoNote}
            </p>
          )}
          <section aria-labelledby="story">
            <h2 id="story" className="font-display text-3xl font-semibold">{t.adventure.story}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ivory-dim">{a.description[locale]}</p>
            <blockquote className="mt-6 border-s-2 border-gold ps-5 font-display text-xl italic text-ivory">
              {a.chapters[0]?.story[locale][1]}
            </blockquote>
          </section>
          <section aria-labelledby="gameplay">
            <h2 id="gameplay" className="font-display text-3xl font-semibold">{t.adventure.gameplay}</h2>
            <ul className="mt-4 space-y-3">
              {a.overview[locale].map((line) => (
                <li key={line} className="flex gap-3 text-ivory-dim">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="instructions">
            <h2 id="instructions" className="font-display text-3xl font-semibold">{t.adventure.instructions}</h2>
            <ol className="mt-4 space-y-3">
              {a.instructions[locale].map((line, i) => (
                <li key={line} className="flex gap-3 text-ivory-dim">
                  <span className="font-display text-xl text-gold">{i + 1}</span>
                  {line}
                </li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="access" className="grid gap-6 sm:grid-cols-2">
            <div className="card p-6">
              <h2 id="access" className="text-lg font-semibold">{t.adventure.accessibility}</h2>
              <p className="mt-2 text-sm text-ivory-dim">{a.accessibility[locale]}</p>
            </div>
            <div className="card p-6">
              <h2 className="text-lg font-semibold">{t.adventure.meetingPoint}</h2>
              <p className="mt-2 text-sm text-ivory-dim">{a.meetingPoint[locale]}</p>
            </div>
          </section>
          <section aria-labelledby="faq">
            <h2 id="faq" className="font-display text-3xl font-semibold">{t.adventure.faq}</h2>
            <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10">
              {a.faq.map((f) => (
                <details key={f.q.en} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {f.q[locale]}
                    <span className="text-gold transition group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 text-ivory-dim">{f.a[locale]}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="eyebrow">{t.adventure.facts}</h2>
            <dl className="mt-4 divide-y divide-white/5 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-ivory-mute">{k}</dt>
                  <dd className="text-end">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-xs text-ivory-mute">{t.adventure.price}</p>
              <p className="font-display text-4xl text-gold">
                {formatPrice(a.priceCents, locale)} <span className="text-base text-ivory-dim">{t.card.perTeam}</span>
              </p>
              <p className="mt-1 text-xs text-ivory-mute">
                {fmt(t.adventure.priceNote, { max: a.teamSize.max, vat: formatPrice(vatShare(a.priceCents), locale) })}
              </p>
            </div>
            <div className="mt-6">
              <PlayButton
                href={`/${locale}/play/${a.slug}`}
                slug={a.slug}
                labels={{ play: t.adventure.play, continue: t.adventure.continue, replay: t.adventure.replay }}
              />
              <p className="mt-3 text-center text-xs text-ivory-mute">{t.adventure.purchaseLater}</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
