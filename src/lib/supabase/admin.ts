import 'server-only';
// Service-role Supabase client. It bypasses row-level security, so it is used only on the server for
// trusted operations the browser must never perform: reading a user's entitlement and recording a
// solve that the server itself has confirmed. It carries no user session and sets no cookies.
//
// Never import this from a Client Component, and never expose the service role key to the browser
// (it is not prefixed NEXT_PUBLIC_). Call isAdminConfigured() before using it.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
