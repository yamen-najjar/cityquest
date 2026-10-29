import Link from 'next/link';
import type { Adventure } from '@/content/types';
import { getCity } from '@/content/cities';
import type { Locale } from '@/i18n/config';
import { fmt, type Dictionary } from '@/i18n/dictionary';
import { formatPrice } from '@/lib/format';
import { SkylineArt } from './SkylineArt';

export function AdventureCard({ adventure: a, locale, dict }: { adventure: Adventure; locale: Locale; dict: Dictionary }) {
  const city = getCity(a.city);
  return (
    <article className="card group relative flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-glow">
      <div className="relative aspect-[16/9] overflow-hidden">
        <SkylineArt idPrefix={`card-${a.slug}`} variant={a.art ?? 'dusk'} className="h-full w-full transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 p-3">
          {a.isDemo && <span className="chip border-gold/40 bg-navy/80 text-gold">{dict.card.demo}</span>}
          <span className="chip bg-navy/80">{dict.themes[a.theme]}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-ivory-mute">{city?.name[locale]}</p>
        <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">
          <Link href={`/${locale}/adventures/${a.slug}`} className="after:absolute after:inset-0">
            {a.title[locale]}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-ivory-dim">{a.description[locale]}</p>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <Fact label={dict.card.duration} value={fmt(dict.units.minutes, { min: a.durationMinutes.min, max: a.durationMinutes.max })} />
          <Fact label={dict.card.distance} value={fmt(dict.units.km, { n: a.distanceKm })} />
          <Fact label={dict.card.difficulty} value={dict.difficulty[a.difficulty]} />
          <Fact label={dict.card.team} value={fmt(dict.units.people, { min: a.teamSize.min, max: a.teamSize.max })} />
          <Fact label={dict.card.age} value={fmt(dict.units.age, { n: a.minAge })} />
          <Fact label={dict.card.languages} value={a.languages.map((l) => l.toUpperCase()).join(' · ')} />
        </dl>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="font-display text-2xl text-gold">{formatPrice(a.priceCents, locale)}</p>
            <p className="text-xs text-ivory-mute">{dict.card.perTeam}</p>
          </div>
          <p className="text-xs text-ivory-mute">{dict.card.noRatings}</p>
        </div>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ivory-mute">{label}</dt>
      <dd className="text-ivory">{value}</dd>
    </div>
  );
}
