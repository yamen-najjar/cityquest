import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdventureCard } from '@/components/AdventureCard';
import { AutoSubmitForm } from '@/components/AutoSubmit';
import { SectionHeading } from '@/components/Section';
import { adventures } from '@/content/adventures';
import { cities, getCity } from '@/content/cities';
import { isLocale, locales } from '@/i18n/config';
import { fmt, getDictionary } from '@/i18n/dictionary';
import { filterAdventures, filterOptions, parseFilters } from '@/lib/catalog';
import { alternates } from '@/lib/site';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.catalog.title, description: t.catalog.intro, alternates: alternates(locale, '/adventures') };
}

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

  const select = (name: keyof typeof f, label: string, options: { value: string; label: string }[]) => (
    <label className="flex flex-col gap-1.5 text-xs text-ivory-mute">
      {label}
      <select name={name} defaultValue={f[name] ?? ''} className="field py-2 text-sm">
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
    <div className="container-cq py-14">
      <SectionHeading level={1} title={t.catalog.title} text={t.catalog.intro} />

      <AutoSubmitForm action={`/${locale}/adventures`} className="card mt-8 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-6">
        <label className="flex flex-col gap-1.5 text-xs text-ivory-mute sm:col-span-2 lg:col-span-1">
          {t.catalog.search}
          <input name="q" type="search" defaultValue={f.q ?? ''} placeholder={t.home.searchPlaceholder} className="field py-2 text-sm" />
        </label>
        {select('city', t.catalog.city, cities.map((c) => ({ value: c.slug, label: c.name[locale] })))}
        {select('theme', t.catalog.theme, filterOptions.themes.map((v) => ({ value: v, label: t.themes[v] })))}
        {select('duration', t.catalog.duration, filterOptions.durations.map((v) => ({ value: v, label: t.catalog.durations[v] })))}
        {select('difficulty', t.catalog.difficulty, filterOptions.difficulties.map((v) => ({ value: v, label: t.difficulty[v] })))}
        {select('group', t.catalog.group, filterOptions.groups.map((v) => ({ value: v, label: t.groups[v] })))}
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-6">
          <button type="submit" className="btn-gold">
            {t.home.searchButton}
          </button>
          {active && (
            <Link href={`/${locale}/adventures`} className="btn-ghost">
              {t.catalog.reset}
            </Link>
          )}
          <p className="ms-auto text-sm text-ivory-dim" role="status">
            {fmt(t.catalog.results, { n: list.length })}
          </p>
        </div>
      </AutoSubmitForm>

      {list.length === 0 ? (
        <p className="card mt-8 p-8 text-ivory-dim">{t.catalog.noResults}</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <AdventureCard key={a.slug} adventure={a} locale={locale} dict={t} />
          ))}
        </div>
      )}
    </div>
  );
}
