'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton({ label, busyLabel, className }: { label: string; busyLabel: string; className?: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function signOut() {
    setBusy(true);
    await createClient().auth.signOut();
    // Re-render the server component tree so the account page shows the signed-out view.
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut} disabled={busy} className={className ?? 'btn-ghost'}>
      {busy ? busyLabel : label}
    </button>
  );
}
