'use client';

// Mounted once, app-wide (in the locale layout, so it covers both the site and the full-screen game).
// It watches the auth session and reconciles local and account progress whenever a session appears —
// on first load for an already-signed-in player, and the moment a player signs in.
import { useEffect } from 'react';
import { reconcileNow } from '@/lib/engine/sync';
import { createClient } from '@/lib/supabase/client';

export function ProgressSync() {
  useEffect(() => {
    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) return;
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') void reconcileNow();
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return null;
}
