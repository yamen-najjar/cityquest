'use client';

// Mounted once, app-wide (in the locale layout, so it covers both the site and the full-screen game).
// It watches the auth session and reconciles local and account progress whenever a session appears —
// on first load for an already-signed-in player, the moment a player signs in, and when the network
// comes back after being offline.
import { useEffect } from 'react';
import { reconcileNow } from '@/lib/engine/sync';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export function ProgressSync() {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    try {
      const supabase = createClient();
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (!session) return;
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') void reconcileNow();
      });
      const onOnline = () => void reconcileNow();
      window.addEventListener('online', onOnline);
      return () => {
        data.subscription.unsubscribe();
        window.removeEventListener('online', onOnline);
      };
    } catch {
      // Never let a sync setup error crash the page tree (and with it the game).
    }
  }, []);

  return null;
}
