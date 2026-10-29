import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SectionHeading } from '@/components/Section';
import { SkylineArt } from '@/components/SkylineArt';
import { adventuresIn } from '@/content/adventures';
import { cities } from '@/content/cities';
import { isLocale } from '@/i18n/config';
import { fmt, getDictionary } from '@/i18n/dictionary';
import { normalizeAnswer } from '@/lib/engine/normalize';
import { alternates } from '@/lib/site';

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

  return (
    <div className="container-cq py-14">
      <SectionHeading level={1} title={t.cities.title} text={t.cities.intro} />

      <form method="get" role="search" className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="city-q" className="sr-only">
          {t.cities.searchLabel}
        </label>
        <input id="city-q" name="q" type="search" defaultValue={q} placeholder={t.cities.searchPlaceholder} className="field sm:max-w-xs" />
        <label className="flex min-h-[44px] items-center gap-2 text-sm text-ivory-dim">
          <input type="checkbox" name="available" value="1" defaultChecked={available === '1'} className="h-4 w-4 accent-[#DDB66A]" />
          {t.cities.availableOnly}
        </label>
        <button type="submit" className="btn-gold">
          {t.home.searchButton}
        </button>
      </form>

      {list.length === 0 ? (
        <p className="card mt-8 p-8 text-ivory-dim">{t.cities.noResults}</p>
      ) : (
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {list.map((c) => {
            const advs = adventuresIn(c.slug);
            const themes = [...new Set(advs.map((a) => a.theme))];
            return (
              <li key={c.slug} className="card overflow-hidden">
                <SkylineArt idPrefix={`cities-${c.slug}`} className="h-52 w-full" />
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {c.pilot && <span className="chip border-gold/40 text-gold">{t.cities.pilot}</span>}
                    <span className={`chip ${c.status === 'available' ? 'text-success' : ''}`}>
                      {c.status === 'available' ? t.cities.available : t.cities.comingSoon}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-3xl font-semibold">{c.name[locale]}</h2>
                  <p className="text-sm text-ivory-mute">{c.region[locale]}</p>
                  <p className="mt-3 text-sm text-ivory-dim">{c.intro[locale]}</p>
                  <p className="mt-4 text-sm">
                    {fmt(t.cities.adventureCount, { n: advs.length })}
                    {themes.length > 0 && (
                      <span className="text-ivory-mute">
                        {' · '}
                        {t.cities.themes}: {themes.map((th) => t.themes[th]).join(', ')}
                      </span>
                    )}
                  </p>
                  <Link href={`/${locale}/cities/${c.slug}`} className="btn-ghost mt-5">
                    {fmt(t.cities.view, { city: c.name[locale] })}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-8 text-sm text-ivory-mute">{t.cities.moreSoon}</p>
    </div>
  );
}
