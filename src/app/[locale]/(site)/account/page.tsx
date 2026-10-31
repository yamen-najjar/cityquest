import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { SectionHeading } from '@/components/Section';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { createClient } from '@/lib/supabase/server';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ error?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).account.title, robots: { index: false } };
}

export default async function AccountPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { error } = await searchParams;
  const t = getDictionary(locale).account;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Remember the language this account prefers. Owner-only by RLS; ignore failures (best effort).
  if (user) await supabase.from('profiles').update({ locale }).eq('id', user.id);

  return (
    <div className="container-cq py-14">
      <SectionHeading level={1} title={t.title} />
      <div className="mt-8 max-w-lg">
        {error === 'callback' && !user && (
          <p role="alert" className="card mb-6 border-danger/40 p-4 text-sm text-danger">
            {t.callbackError}
          </p>
        )}

        {user ? (
          <div className="card p-8">
            <p className="text-sm text-ivory-mute">{t.signedInAs}</p>
            <p className="mt-1 break-all font-display text-xl text-gold" dir="ltr">
              {user.email}
            </p>
            <p className="mt-4 text-sm text-ivory-dim">{t.syncNote}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/${locale}/dashboard`} className="btn-gold">
                {t.myAdventures}
              </Link>
              <SignOutButton label={t.signOut} busyLabel={t.signingOut} />
            </div>
          </div>
        ) : (
          <SignInForm locale={locale} t={t} />
        )}
      </div>
    </div>
  );
}
