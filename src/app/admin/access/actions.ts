'use server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin/access';
import { grantEntitlement, revokeEntitlement, type GrantResult } from '@/lib/admin/data';

// Server actions are directly invocable, so each re-checks admin rights before doing anything.

export async function grantAction(_prev: GrantResult | null, formData: FormData): Promise<GrantResult> {
  await requireAdmin();
  const email = String(formData.get('email') ?? '');
  const adventure = String(formData.get('adventure') ?? '');
  if (!/^[a-z0-9-]+$/.test(adventure)) return { ok: false, message: 'Pick an adventure.' };
  const result = await grantEntitlement(email, adventure);
  if (result.ok) revalidatePath('/admin/access');
  return result;
}

export async function revokeAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const userId = String(formData.get('userId') ?? '');
  const adventure = String(formData.get('adventure') ?? '');
  if (!userId || !adventure) return;
  await revokeEntitlement(userId, adventure);
  revalidatePath('/admin/access');
}
