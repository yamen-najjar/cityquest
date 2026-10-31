// Keeps the auth session fresh on every request. Supabase access tokens are short-lived; without this
// refresh a signed-in player would be logged out as soon as the token expired. Called from the app
// middleware (src/middleware.ts) on the response it already built for the locale handling, so the
// refreshed cookies ride along on that same response.
import { createServerClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured } from './config';

export async function refreshSession(request: NextRequest, response: NextResponse): Promise<void> {
  // With no backend configured (fresh clone, CI, preview without env), skip auth entirely and never 500.
  if (!isSupabaseConfigured()) return;

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Update the request too, so Server Components in this same request read the refreshed token
            // instead of the old one (and do not refresh again with an already-rotated token).
            for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
            for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
          },
        },
      },
    );

    // Touching the user is what triggers a token refresh when needed. Do not run code between creating
    // the client and this call (a Supabase SSR requirement), and never trust it for authorization in
    // middleware — pages and route handlers re-check with their own server client.
    await supabase.auth.getUser();
  } catch {
    // A Supabase outage or a transient error must never take the whole site down.
  }
}
