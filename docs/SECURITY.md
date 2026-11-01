# Security and reliability review (2026-11-01)

A focused pass over saving, sync, the API and the database rules. What was fixed is listed with its test.
What was reviewed and found sound is listed so the next review can skip it. What is still open is at the
end, honestly.

## Fixed

| Problem | Fix | Test |
| --- | --- | --- |
| Journal notes typed less than 0.5 s before closing the journal or the page were lost (the debounce timer was cleared on unmount). | Notes are written straight to the save on close, `pagehide` and tab hide (`Journal.tsx`, `GameClient.saveNotes`). | `e2e/stability.spec.ts` |
| One unreadable record in localStorage hid **every** adventure from the dashboard and the sync (the whole loop sat in one `try`). | Each record is read on its own (`storage.ts`). | `unit/stability.test.ts`, `e2e/stability.spec.ts` |
| `parseProgress` trusted most fields. `chapter: NaN`, a string in `hintsUsed` or a huge list passed through and crashed or skewed the game (NaN XP, broken merges). | Core fields are strictly checked; the rest is repaired field by field; unknown fields are dropped (`progress.ts`). | `unit/stability.test.ts` |
| A save whose chapter index pointed past the end (corrupt, or a story that changed) jumped straight to the finale. | `fitToAdventure` keeps a save inside the current story: known chapters and items only, chapter ≤ first unsolved. | unit + e2e |
| "Start over" while offline: the account delete failed silently, and the next sync brought the old game back over the new one. | The restart is remembered on the device and retried before any merge; pushes for that adventure wait until it lands (`sync.ts`). | marker logic in `unit/stability.test.ts` |
| Signing out and in as someone else within 1.5 s could push the previous player's game into the new account. | Pending pushes are cancelled on sign-out. | — (timing; reviewed) |
| **Security:** any signed-in player could rewrite `profiles.email` (RLS allowed every column). The admin console grants adventures by that email, so a player could claim a customer's access. | Migration `20261101090000_lock_profile_email.sql`: the browser roles may only write `display_name` and `locale`; the email follows `auth.users` by trigger; existing rows are repaired. | Needs the local Supabase stack (see below) |
| The answer check had no rate limit or size limit: a script could try all 10,000 four-digit codes in seconds. | 40 checks a minute per client per adventure, 120 overall, a 2 KB body limit, 429 with `Retry-After`, and a "too many tries" message in all four languages. | `unit/check-route.test.ts` |
| The newsletter form could be scripted to send confirmation emails to many inboxes. | 5 sign-ups per 10 minutes per client; token actions are limited too. | — |
| Error logs could include whole error objects. | The paid-check log keeps only the slug, the chapter and the message, never player data. | — |
| No CSP at all. | The safe part: `object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`. | — |

## Reviewed, no change needed

- RLS on `progress`, `entitlements`, `solves`, `admin_users`, `adventure_state`, `newsletter_subscribers`: browser roles cannot write entitlements, solves, admin rows or adventure state; the "furthest progress wins" trigger stops a stale push from rolling account progress back.
- Every admin page and server action calls `requireAdmin()` (404 for everyone else; admin requires a confirmed email and a row only the service role can write).
- Account deletion deletes the auth user first (cascading), then the newsletter row; the data export requires a session and is `no-store`.
- The magic-link callback only redirects to a localized path on this origin.
- The service-role key is only read in `server-only` modules.

## Still open

1. **Publishing from the admin console has no public effect.** The toggle writes `adventure_state`, but the public catalogue and play pages read the `status` in the content files only. Left untouched on purpose in this pass (publishing is out of scope for now); it needs a decision on whether public pages should read the database.
2. **The rate limits live in server memory.** On a host with many instances each counts separately. Cheap, but a shared counter (a Supabase table) is the step up once the site is deployed.
3. **The profile-email migration has not been run against a database here** (no Docker or Supabase CLI on this machine). Run `supabase db reset` and the `@backend` e2e specs before merging.
4. **A full CSP** (scripts, styles, `connect-src` for Supabase and the map tiles) needs nonces for Next's inline scripts; it is a separate piece of work.
5. **Restarting on one device while another device still holds the old game:** if that device syncs later, it pushes the old (further) game back. Fixing that needs a "run id" on saves. It is rare, and noted for the sync design.
6. **Accessibility** was not part of this pass beyond the existing dialog focus and RTL handling; a dedicated audit (focus traps in the journal and the restart dialog, contrast) is still to do.
