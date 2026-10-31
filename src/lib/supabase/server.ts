// Server-side Supabase client, for Server Components, Route Handlers and Server Actions. It reads the
// session from the request cookies and, where it can, writes refreshed cookies back. In a Server
// Component the cookie store is read-only, so writing throws and is ignored: the middleware
// (src/middleware.ts) refreshes the session cookie on every request instead.
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
          } catch {
            // Called from a Server Component where cookies are read-only; the middleware handles the refresh.
          }
        },
      },
    },
  );
}
