'use server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin/access';
import { setAdventureStatus } from '@/lib/admin/data';

export async function setStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = String(formData.get('slug') ?? '');
  const status = String(formData.get('status') ?? '');
  if (status !== 'draft' && status !== 'published') return;
  await setAdventureStatus(slug, status);
  revalidatePath('/admin/adventures');
}
