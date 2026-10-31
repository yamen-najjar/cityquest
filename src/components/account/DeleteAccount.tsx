'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAccountAction } from '@/app/[locale]/(site)/account/actions';
import { clearAllLocalProgress } from '@/lib/engine/storage';
import type { Dictionary } from '@/i18n/dictionary';

type Props = { locale: string; email: string; t: Dictionary['account'] };

export function DeleteAccount({ locale, email, t }: Props) {
  const router = useRouter();
  const [confirm, setConfirm] = useState('');
  const [state, setState] = useState<'idle' | 'working' | 'error'>('idle');

  const matches = confirm.trim().toLowerCase() === email.toLowerCase();

  async function onDelete() {
    if (!matches) return;
    setState('working');
    const { ok } = await deleteAccountAction();
    if (!ok) {
      setState('error');
      return;
    }
    // Account is gone server-side; wipe this device's local save and leave the account area.
    try {
      clearAllLocalProgress();
    } catch {
      // Private window or blocked storage — nothing to clear.
    }
    router.replace(`/${locale}`);
    router.refresh();
  }

  return (
    <div className="card border-danger/30 p-6">
      <h2 className="font-display text-lg text-danger">{t.deleteTitle}</h2>
      <p className="mt-2 text-sm text-ivory-dim">{t.deleteText}</p>
      <label htmlFor="delete-confirm" className="mt-4 block text-sm text-ivory-mute">
        {t.deleteConfirmLabel}
      </label>
      <input
        id="delete-confirm"
        type="email"
        dir="ltr"
        autoComplete="off"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="field mt-1.5 max-w-sm"
        placeholder={email}
      />
      <div className="mt-4">
        <button
          type="button"
          onClick={onDelete}
          disabled={!matches || state === 'working'}
          className="btn border border-danger/50 text-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === 'working' ? t.deleting : t.deleteButton}
        </button>
      </div>
      {confirm.length > 0 && !matches && <p className="mt-2 text-sm text-danger">{t.deleteMismatch}</p>}
      {state === 'error' && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {t.deleteError}
        </p>
      )}
    </div>
  );
}
