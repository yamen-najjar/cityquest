import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrintButton } from '@/components/PrintButton';
import { adventures, getAdventure } from '@/content/adventures';
import { getCity } from '@/content/cities';
import { isLocale, locales } from '@/i18n/config';
import { fmt, getDictionary } from '@/i18n/dictionary';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => adventures.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = getAdventure(slug);
  if (!isLocale(locale) || !a) return {};
  return { title: `${getDictionary(locale).dossier.title} – ${a.title[locale]}`, robots: { index: false } };
}

/**
 * The case dossier: one sheet to print and bring along, read before playing. Everything on it is known
 * before the first message arrives, so it spoils nothing.
 */
export default async function DossierPage({ params }: Props) {
  const { locale, slug } = await params;
  const a = getAdventure(slug);
  if (!isLocale(locale) || !a) notFound();
  const t = getDictionary(locale);
  const d = t.dossier;
  const city = getCity(a.city);
  const facts: [string, string][] = [
    [t.adventure.meetingPoint, a.meetingPoint[locale]],
    [t.card.duration, fmt(t.units.minutes, { min: a.durationMinutes.min, max: a.durationMinutes.max })],
    [t.card.distance, fmt(t.units.km, { n: a.distanceKm })],
    [t.adventure.checkpoints, String(a.chapters.length)],
    [t.card.team, fmt(t.units.people, { min: a.teamSize.min, max: a.teamSize.max })],
    [t.card.age, fmt(t.units.age, { n: a.minAge })],
  ];

  return (
    <div className="container-cq py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href={`/${locale}/adventures/${a.slug}`} className="text-sm text-ivory-dim hover:text-ivory">
          ← {d.back}
        </Link>
        <PrintButton label={d.print} />
      </div>

      <article id="dossier" className="mx-auto max-w-3xl rounded-sm bg-[#f4ecd8] p-6 text-[#2b2116] shadow-2xl sm:p-10">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#2b2116] pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] rtl:tracking-normal">CityQuest · {d.title}</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">{a.title[locale]}</h1>
            <p className="mt-1 text-sm">
              {city?.name[locale]} · {a.tagline[locale]}
            </p>
          </div>
          <p className="-rotate-6 rounded border-2 border-[#9b2c2c] px-3 py-1 text-sm font-bold uppercase tracking-widest text-[#9b2c2c] rtl:tracking-normal">{d.confidential}</p>
        </header>

        <section className="mt-6" aria-labelledby="brief">
          <h2 id="brief" className="text-xs font-bold uppercase tracking-[0.2em] rtl:tracking-normal">
            {d.brief}
          </h2>
          <div className="mt-2 space-y-3 font-display text-lg leading-relaxed">
            {(a.dossier?.[locale] ?? [a.description[locale]]).map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </section>

        <section className="mt-6" aria-labelledby="facts">
          <h2 id="facts" className="text-xs font-bold uppercase tracking-[0.2em] rtl:tracking-normal">
            {d.facts}
          </h2>
          <dl className="mt-2 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {facts.map(([k, v]) => (
              <div key={k} className="border-b border-dotted border-[#2b2116]/40 pb-1">
                <dt className="text-xs opacity-70">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <section aria-labelledby="detectives">
            <h2 id="detectives" className="text-xs font-bold uppercase tracking-[0.2em] rtl:tracking-normal">
              {d.detective}
            </h2>
            <div className="mt-2 space-y-5" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-6 border-b border-[#2b2116]/50" />
              ))}
            </div>
          </section>
          <section aria-labelledby="bring">
            <h2 id="bring" className="text-xs font-bold uppercase tracking-[0.2em] rtl:tracking-normal">
              {d.bring}
            </h2>
            <ul className="mt-2 space-y-2 text-sm">
              {d.bringList.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">☐</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-6" aria-labelledby="notes">
          <h2 id="notes" className="text-xs font-bold uppercase tracking-[0.2em] rtl:tracking-normal">
            {d.notes}
          </h2>
          <div className="mt-2 space-y-6" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-5 border-b border-[#2b2116]/30" />
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-xs opacity-70">{d.noSpoilers}</p>
      </article>
    </div>
  );
}
