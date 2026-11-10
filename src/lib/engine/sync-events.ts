// The event a reconcile fires when it changed this device's saves. Its own module, so a page that only
// listens for it (the dashboard) does not pull in the Supabase client with sync.ts.
export const SYNCED_EVENT = 'cityquest:synced';

/**
 * What the app does for an auth event: sync when a session appears; forget the offline packs and queued
 * answers when the session ends by any route (sign-out, but also a revoked or invalid refresh token, which
 * never goes through signOutAndClear). INITIAL_SESSION without a session is just a signed-out page load.
 */
export function authEventAction(event: string, hasSession: boolean): 'reconcile' | 'clear-offline' | null {
  if (event === 'SIGNED_OUT') return 'clear-offline';
  if (hasSession && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN')) return 'reconcile';
  return null;
}
