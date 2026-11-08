import type { Viewport } from 'next';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { groteskLatin, groteskLatinExt } from '@/lib/fonts-site';
import './site.css';

export const viewport: Viewport = { themeColor: '#121922', colorScheme: 'dark' };

// Every page except the game screen, which runs full-screen without the site chrome.
// No session is read here on purpose: the header reads auth in the browser, so these pages stay static.
// The Ter plaatse theme (site.css) is scoped to .theme-site, so the game and the admin console keep their look.
export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <div className={`theme-site ${groteskLatin.variable} ${groteskLatinExt.variable}`}>
      <SiteHeader locale={locale} nav={t.nav} />
      <div className="tp-banner">
        <p className="tp-wrap">{t.prototype.banner}</p>
      </div>
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} dict={t} />
    </div>
  );
}
