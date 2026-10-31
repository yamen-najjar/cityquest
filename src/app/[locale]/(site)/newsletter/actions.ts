'use server';
import { headers } from 'next/headers';
import { subscribe, type SubscribeResult } from '@/lib/newsletter/subscribe.server';

export async function subscribeAction(locale: string, email: string): Promise<SubscribeResult> {
  const h = await headers();
  const host = h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? (/^(localhost|127\.)/.test(host) ? 'http' : 'https');
  return subscribe(email, locale, `${proto}://${host}`);
}
