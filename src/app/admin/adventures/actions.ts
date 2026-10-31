'use server';
import { revalidatePath } from 'next/cache';
import { allAdventures } from '@/content/adventures';
import { requireAdmin } from '@/lib/admin/access';
import { setAdventureStatus } from '@/lib/admin/data';

const KNOWN_SLUGS = new Set(allAdventures.map((a) => a.slug));

export async function setStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = String(formData.get('slug') ?? '');
  const status = String(formData.get('status') ?? '');
  // Only a known adventure and a valid state; both come from the form body.
  if (!KNOWN_SLUGS.has(slug) || (status !== 'draft' && status !== 'published')) return;
  await setAdventureStatus(slug, status);
  revalidatePath('/admin/adventures');
}
