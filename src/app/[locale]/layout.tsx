import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, Noto_Kufi_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
import { ProgressSync } from '@/components/ProgressSync';
import { dirOf, isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { alternates, ogLocale, siteUrl } from '@/lib/site';

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const arabic = Noto_Kufi_Arabic({ subsets: ['arabic'], weight: ['400', '500', '600', '700'], variable: '--font-arabic', display: 'swap' });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#0B1324',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `CityQuest – ${t.meta.slogan}`, template: '%s · CityQuest' },
    description: t.meta.description,
    alternates: alternates(locale, ''),
    manifest: '/manifest.webmanifest',
    icons: { icon: '/icon.svg' },
    openGraph: {
      type: 'website',
      siteName: 'CityQuest',
      locale: ogLocale[locale],
      title: `CityQuest – ${t.meta.slogan}`,
      description: t.meta.description,
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <html lang={locale} dir={dirOf(locale)} className={`${display.variable} ${sans.variable} ${arabic.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a href="#main" className="sr-only z-50 rounded-full bg-gold px-4 py-2 text-navy focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
          {t.nav.skip}
        </a>
        <ProgressSync />
        {children}
      </body>
    </html>
  );
}
