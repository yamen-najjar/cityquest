'use server';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

/**
 * Permanently delete the signed-in user's account (GDPR erasure). Deleting the auth user cascades every
 * owned row — profiles, progress, entitlements, solves, admin_users — and the newsletter row (keyed by
 * email, not by the user id) is removed explicitly. The client then clears its local save and signs out.
 */
export async function deleteAccountAction(): Promise<{ ok: boolean }> {
  if (!isAdminConfigured()) return { ok: false };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const admin = createAdminClient();
  // Delete the account first; only if that succeeds remove the newsletter row (which is keyed by email,
  // not cascaded). This way a failed deletion never silently drops the newsletter subscription.
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return { ok: false };
  if (user.email) await admin.from('newsletter_subscribers').delete().eq('email', user.email.toLowerCase());
  return { ok: true };
}
