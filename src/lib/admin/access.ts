import 'server-only';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// Admin identity. Membership in `admin_users` is the only thing that grants admin rights, and it is
// read here with the service role (RLS lets a user read only their own row anyway). Admin status is
// never derived from anything the client can set.

/**
 * The signed-in user if they are an admin, otherwise null. Wrapped in React.cache so the layout and the
 * page in one request share a single getUser() + lookup rather than running it twice.
 */
export const getAdminUser = cache(async (): Promise<User | null> => {
  if (!isAdminConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Require a confirmed email: admin is granted only to confirmed accounts (see the harden_admin
  // migration), and this refuses any account that somehow is not.
  if (!user || !user.email_confirmed_at) return null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error || !data) return null;
  return user;
});

/**
 * Gate for every admin page and server action. A non-admin (signed out, or signed in without an
 * `admin_users` row) gets a 404, so the console's existence is never revealed.
 */
export async function requireAdmin(): Promise<User> {
  const user = await getAdminUser();
  if (!user) notFound();
  return user;
}
