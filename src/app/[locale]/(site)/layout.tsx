import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { createClient } from '@/lib/supabase/server';

// Every page except the game screen, which runs full-screen without the site chrome.
export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <SiteHeader locale={locale} nav={t.nav} authed={!!user} />
      <div className="border-b border-gold/15 bg-gold/[0.06]">
        <p className="container-cq py-2 text-center text-xs text-ivory-dim">
          <span className="me-2 rounded-full border border-gold/40 px-2 py-0.5 text-[10px] font-semibold uppercase text-gold">
            {t.prototype.badge}
          </span>
          {t.prototype.banner}
        </p>
      </div>
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} dict={t} />
    </>
  );
}
