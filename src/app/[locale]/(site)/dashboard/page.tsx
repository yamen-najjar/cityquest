import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Dashboard } from '@/components/Dashboard';
import { SectionHeading } from '@/components/Section';
import { adventures } from '@/content/adventures';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { contextOf } from '@/lib/engine/achievements';

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
    <div className="container-cq py-14">
      <SectionHeading level={1} title={t.dashboard.title} text={t.dashboard.intro} />
      <Dashboard
        locale={locale}
        t={t.dashboard}
        achievements={t.achievements}
        adventures={adventures.map((a) => ({ slug: a.slug, title: a.title[locale], chapters: a.chapters.length, context: contextOf(a) }))}
      />
    </div>
  );
}
