'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOutAndClear } from '@/lib/engine/sync';

export function SignOutButton({ label, busyLabel, className }: { label: string; busyLabel: string; className?: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function signOut() {
    setBusy(true);
    // Signs out this device and clears local saves, so they never merge into the next account here.
    await signOutAndClear();
    // Re-render the server component tree so the account page shows the signed-out view.
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut} disabled={busy} className={className ?? 'btn-ghost'}>
      {busy ? busyLabel : label}
    </button>
  );
}
