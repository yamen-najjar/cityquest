'use client';
import { useActionState, useEffect, useState } from 'react';
import { grantAction } from '@/app/admin/access/actions';

export function GrantForm({ adventures }: { adventures: { slug: string; title: string }[] }) {
  const [state, action, pending] = useActionState(grantAction, null);
  // React 19 resets the form after an action; keep the email controlled so it survives an error.
  const [email, setEmail] = useState('');
  // Clear it once a grant succeeds; keep it on an error so it can be corrected.
  useEffect(() => {
    if (state?.ok) setEmail('');
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-3 px-3 py-2">
      <div>
        <label htmlFor="g-email" className="mb-1.5 block text-[0.74rem] uppercase tracking-[0.06em] text-ivory-mute">
          Player email
        </label>
        <input
          id="g-email"
          name="email"
          type="email"
          required
          placeholder="name@example.com"
          className="field"
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="g-adv" className="mb-1.5 block text-[0.74rem] uppercase tracking-[0.06em] text-ivory-mute">
          Adventure
        </label>
        <select id="g-adv" name="adventure" className="field" defaultValue={adventures[0]?.slug}>
          {adventures.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.title}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn-gold" disabled={pending}>
        {pending ? 'Granting…' : 'Grant access'}
      </button>
      <p role="status" className={`text-sm ${state ? (state.ok ? 'text-success' : 'text-danger') : 'text-ivory-mute'}`}>
        {state ? state.message : 'The player must already have an account (magic-link sign-in).'}
      </p>
    </form>
  );
}
