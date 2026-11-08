import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Dashboard } from '@/components/Dashboard';
import { adventures } from '@/content/adventures';
import { getCity } from '@/content/cities';
import { meta } from '@/content/meta';
import { getPresentation } from '@/content/presentation';
import { isLocale } from '@/i18n/config';
import { fmt, getDictionary } from '@/i18n/dictionary';
import { contextOf } from '@/lib/engine/achievements';
import './dashboard.css';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).dashboard.title, robots: { index: false } };
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <Dashboard
      locale={locale}
      t={t.dashboard}
      achievements={t.achievements}
      labels={{
        modes: {
          junior: t.game.modes.junior.name,
          relaxed: t.game.modes.relaxed.name,
          classic: t.game.modes.classic.name,
          expert: t.game.modes.expert.name,
        },
        ranks: t.game.ranks,
        lost: t.game.danger.lost,
        routeStart: t.home.routeStart,
        credit: t.site.photoCredit,
      }}
      adventures={adventures.map((a) => {
        const p = getPresentation(a.slug);
        const city = getCity(a.city)?.name[locale] ?? '';
        return {
          slug: a.slug,
          title: a.title[locale],
          city,
          chapters: a.chapters.length,
          photo: p.homePhoto ?? p.photo,
          start: p.start[locale],
          notStartedLine: fmt(t.dashboard.notStartedLine, {
            total: a.chapters.length,
            city,
            duration: fmt(t.units.minutes, { min: a.durationMinutes.min, max: a.durationMinutes.max }),
            age: fmt(t.units.age, { n: a.minAge }),
          }),
          context: contextOf(a),
          secrets: (a.secrets ?? []).map((s) => s.id),
          token: a.token && { order: a.token.order, fragment: a.token.fragment[locale] },
          letter: a.ending.letter && { from: a.ending.letter.from[locale], text: a.ending.letter.text[locale] },
        };
      })}
      meta={{ title: meta.title[locale], intro: meta.intro[locale], from: meta.from[locale], solved: meta.solved[locale] }}
    />
  );
}
