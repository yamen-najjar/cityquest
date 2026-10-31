'use server';
import { revalidatePath } from 'next/cache';
import { allAdventures } from '@/content/adventures';
import { requireAdmin } from '@/lib/admin/access';
import { grantEntitlement, revokeEntitlement, type GrantResult } from '@/lib/admin/data';

// Server actions are directly invocable, so each re-checks admin rights before doing anything, and
// validates its inputs (an attacker controls the form body).
const KNOWN_SLUGS = new Set(allAdventures.map((a) => a.slug));
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function grantAction(_prev: GrantResult | null, formData: FormData): Promise<GrantResult> {
  await requireAdmin();
  const email = String(formData.get('email') ?? '');
  const adventure = String(formData.get('adventure') ?? '');
  if (!KNOWN_SLUGS.has(adventure)) return { ok: false, message: 'Pick an adventure.', email };
  const result = await grantEntitlement(email, adventure);
  if (result.ok) revalidatePath('/admin/access');
  return result;
}

export async function revokeAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const userId = String(formData.get('userId') ?? '');
  const adventure = String(formData.get('adventure') ?? '');
  if (!UUID.test(userId) || !KNOWN_SLUGS.has(adventure)) return;
  await revokeEntitlement(userId, adventure);
  revalidatePath('/admin/access');
}
