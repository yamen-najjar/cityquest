// Browser-side Supabase client, for use inside client components. The anon key is safe to ship to the
// browser: row-level security decides what it may read or write (see supabase/migrations).
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
