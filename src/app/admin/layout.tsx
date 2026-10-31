import type { Metadata } from 'next';
import '../globals.css';
import { AdminNav } from '@/components/admin/AdminNav';
import { requireAdmin } from '@/lib/admin/access';
import { display, sans } from '@/lib/fonts';

// The admin console is its own root layout (own <html>/<body>), outside the locale structure. It is
// English-only and never indexed.

export const metadata: Metadata = {
  title: { default: 'CityQuest Admin', template: '%s · CityQuest Admin' },
  robots: { index: false, follow: false },
  icons: { icon: '/icon.svg' },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Non-admins (signed out, or without an admin_users row) get a 404 here, so the console stays hidden.
  const user = await requireAdmin();

  return (
    <html lang="en" dir="ltr" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh bg-navy font-sans text-ivory antialiased">
        <div className="grid min-h-dvh md:grid-cols-[248px_1fr]">
          <aside className="flex items-center gap-2 border-b border-white/10 py-3 md:flex-col md:items-stretch md:gap-5 md:border-b-0 md:border-r md:py-5">
            <div className="flex items-center gap-2 px-4 md:px-5">
              <span className="grid size-[30px] place-items-center rounded-[9px] bg-gradient-to-br from-gold-soft to-gold-deep font-display font-bold text-navy">
                C
              </span>
              <span className="leading-tight">
                <b className="font-display text-[1.05rem] font-semibold">CityQuest</b>
                <span className="hidden text-[0.68rem] uppercase tracking-[0.12em] text-ivory-mute md:block">
                  Admin console
                </span>
              </span>
            </div>
            <AdminNav />
            <div className="ms-auto hidden border-t border-white/5 px-5 pt-4 text-[0.78rem] text-ivory-mute md:mt-auto md:ms-0 md:block">
              Signed in as
              <br />
              <b className="break-all font-semibold text-ivory-dim" dir="ltr">
                {user.email}
              </b>
              <br />
              Admin
            </div>
          </aside>
          <main className="min-w-0 px-4 pb-16 sm:px-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
