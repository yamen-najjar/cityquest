import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdventureCard } from '@/components/AdventureCard';
import { NewsletterForm } from '@/components/NewsletterForm';
import { SectionHeading } from '@/components/Section';
import { SkylineArt } from '@/components/SkylineArt';
import { adventures, adventuresIn } from '@/content/adventures';
import { cities } from '@/content/cities';
import type { Theme } from '@/content/types';
import { isLocale } from '@/i18n/config';
import { fmt, getDictionary } from '@/i18n/dictionary';

const categoryOrder: Theme[] = ['mystery', 'detective', 'treasure', 'escape'];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const demo = adventures.find((a) => a.isDemo);
  const liveThemes = new Set(adventures.map((a) => a.theme));

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
        <SkylineArt idPrefix="hero" className="absolute inset-0 -z-10 h-full w-full" />
        <div className="container-cq flex min-h-[78vh] flex-col justify-center py-20 sm:min-h-[82vh]">
          <p className="eyebrow animate-rise">{t.home.eyebrow}</p>
          <h1 id="hero-title" className="mt-4 max-w-3xl animate-rise font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
            {t.meta.slogan}
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-lg text-ivory-dim">{t.home.heroText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {demo && (
              <Link href={`/${locale}/play/${demo.slug}`} className="btn-gold px-7 text-base">
                {t.home.ctaPrimary}
              </Link>
            )}
            <Link href={`/${locale}/adventures`} className="btn-ghost px-7 text-base">
              {t.home.ctaSecondary}
            </Link>
          </div>

          <form action={`/${locale}/adventures`} method="get" role="search" className="mt-10 flex max-w-xl gap-2 rounded-full border border-white/10 bg-navy/70 p-1.5 backdrop-blur">
            <label htmlFor="hero-search" className="sr-only">
              {t.home.searchLabel}
            </label>
            <input id="hero-search" name="q" type="search" placeholder={t.home.searchPlaceholder} className="min-h-[44px] min-w-0 flex-1 bg-transparent px-4 text-ivory placeholder:text-ivory-mute focus:outline-none" />
            <button type="submit" className="btn-gold">
              {t.home.searchButton}
            </button>
          </form>
        </div>
      </section>

      {/* Featured cities */}
      <section className="container-cq mt-20" aria-labelledby="cities-title">
        <SectionHeading id="cities-title" title={t.home.citiesTitle} text={t.home.citiesText} />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {cities.map((c) => (
            <Link key={c.slug} href={`/${locale}/cities/${c.slug}`} className="card group relative overflow-hidden">
              <SkylineArt idPrefix={`city-${c.slug}`} className="h-56 w-full transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="chip border-gold/40 text-gold">{t.cities.pilot}</span>
                <h3 className="mt-2 font-display text-3xl font-semibold">{c.name[locale]}</h3>
                <p className="text-sm text-ivory-dim">{fmt(t.cities.adventureCount, { n: adventuresIn(c.slug).length })}</p>
              </div>
            </Link>
          ))}
          <div className="card flex flex-col justify-center p-8">
            <p className="text-ivory-dim">{t.cities.moreSoon}</p>
          </div>
        </div>
      </section>

      {/* Featured adventures */}
      <section className="container-cq mt-24" aria-labelledby="adv-title">
        <SectionHeading id="adv-title" title={t.home.adventuresTitle} text={t.home.adventuresText} />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {adventures.map((a) => (
            <AdventureCard key={a.slug} adventure={a} locale={locale} dict={t} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container-cq mt-24" aria-labelledby="how-title">
        <SectionHeading id="how-title" title={t.home.howTitle} />
        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.home.how.map((step, i) => (
            <li key={step.title} className="card p-6">
              <span className="font-display text-4xl text-gold" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-ivory-dim">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Categories */}
      <section className="container-cq mt-24" aria-labelledby="cat-title">
        <SectionHeading id="cat-title" title={t.home.categoriesTitle} />
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categoryOrder.map((theme) => {
            const live = liveThemes.has(theme);
            const body = (
              <>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-2xl font-semibold">{t.themes[theme]}</h3>
                  <span className={`chip ${live ? 'border-gold/40 text-gold' : ''}`}>{live ? t.home.available : t.home.comingSoon}</span>
                </div>
                <p className="mt-3 text-sm text-ivory-dim">{t.home.categories[theme]}</p>
              </>
            );
            return (
              <li key={theme}>
                {live ? (
                  <Link href={`/${locale}/adventures?theme=${theme}`} className="card block h-full p-6 transition hover:shadow-glow">
                    {body}
                  </Link>
                ) : (
                  <div className="card h-full p-6 opacity-70">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Reviews: none are shown until real players have left them. */}
      <section className="container-cq mt-24" aria-labelledby="reviews-title">
        <SectionHeading id="reviews-title" title={t.home.reviewsTitle} />
        <p className="card mt-8 p-8 text-ivory-dim">{t.home.reviewsEmpty}</p>
      </section>

      {/* Gift vouchers */}
      <section className="container-cq mt-24" aria-labelledby="voucher-title">
        <div className="card relative overflow-hidden border-gold/30 p-8 sm:p-12">
          <div className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
          <span className="chip border-gold/40 text-gold">{t.home.voucherBadge}</span>
          <h2 id="voucher-title" className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            {t.home.voucherTitle}
          </h2>
          <p className="mt-3 max-w-xl text-ivory-dim">{t.home.voucherText}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-cq mt-24" aria-labelledby="faq-title">
        <SectionHeading id="faq-title" title={t.home.faqTitle} />
        <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10">
          {t.home.faq.map((f) => (
            <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.q}
                <span className="text-gold transition group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 text-ivory-dim">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-cq mt-24" aria-labelledby="news-title">
        <div className="card p-8 sm:p-12">
          <h2 id="news-title" className="font-display text-3xl font-semibold">
            {t.home.newsletterTitle}
          </h2>
          <p className="mt-2 text-ivory-dim">{t.home.newsletterText}</p>
          <NewsletterForm t={t.home} locale={locale} />
        </div>
      </section>
    </>
  );
}
