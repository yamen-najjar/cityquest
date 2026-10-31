# Phase 2 — Real backend

Tracking document for Phase 2. Kept in sync with the code: every decision and every completed step is
recorded here so the work stays auditable and reversible.

**Branch:** `phase-2-backend` · **Status:** Milestone 1 complete (reviewed) · **Started:** 2026-10-31

## Goal (from the roadmap)

Supabase (PostgreSQL, Auth with email magic links), profiles, progress saved to the account, purchased
adventures, admin dashboard, server-enforced roles with row-level security, account deletion and data
export (GDPR), newsletter with double opt-in.

## How we work

- **Local Supabase (Docker) for development.** The whole stack (Postgres + Auth + Studio) runs on the
  machine via the Supabase CLI. Nothing leaves the machine; no account needed to build.
- **Cloud-ready from day one.** All Supabase access goes through env vars (`.env.local`), so moving to a
  hosted Supabase project at launch is a config change, not a rewrite. Migrations are the single source
  of truth for the schema, so the same SQL provisions the cloud project.
- **Structured and tidy.** One feature branch, small reviewable commits, this document updated as we go.
  Each milestone is tested (unit + typecheck + build, e2e where it applies) before the next begins.
- **Review before merge.** A reviewer agent (Sonnet 5.5) audits the milestone diff before anything merges.

## Key technical decisions

| # | Decision | Why |
|---|---|---|
| D1 | `@supabase/ssr` + `@supabase/supabase-js` for App Router auth | Current supported SSR approach; `auth-helpers` is deprecated. Cookie-based sessions work in Server Components, Route Handlers and middleware. |
| D2 | **Offline-first progress, Supabase as the durable mirror** | The game must keep working with no account and on flaky mobile networks. localStorage stays the instant source of truth; Supabase syncs in the background and gives cross-device + account-bound saves. On login, local and remote progress are **merged** (see D3), not overwritten. |
| D3 | Merge rule on login: keep the **furthest** progress per adventure | Prevents losing a guest game when signing in, and losing an account game when playing as guest first. "Furthest" = more solved chapters, then later `lastActiveAt`. |
| D4 | Keep `ProgressStore` interface shape; add an async-capable sync layer beside it | The game screen keeps reading synchronously from local; sync is a separate concern, so GameClient barely changes. |
| D5 | RLS on every table, owner-only by default; admin via a server-checked role | Least privilege. No table is readable/writable without a policy. Admin writes go through the service role on the server, never the browser. |
| D6 | Magic-link (passwordless) email auth | Matches the roadmap; no password storage; lowest-friction for a consumer game. Local dev reads the link from the Supabase CLI mail catcher (Mailpit). |
| D7 | "Furthest wins" is also a **server-side** invariant (DB trigger `keep_furthest_progress`) | A client push can never regress account progress regardless of timing. The client merge rule and the DB trigger use the same ordering (finished > more solved > later lastActiveAt). Added after the M1 review found a last-write-wins data-loss path. |
| D8 | The site must boot with Supabase **unconfigured** | `isSupabaseConfigured()` guards every Supabase entry point; with no env the app runs signed-out, offline-only, and never 500s (CI, preview deploys, fresh clones). |

## Milestones

### M1 — Foundation (in progress)
- [x] Supabase CLI installed, `supabase init`, local stack running (Docker)
- [x] Schema migration: `profiles`, `progress` + RLS policies (verified: RLS on, 7 policies, auth trigger)
- [x] Generated DB types (`src/lib/supabase/database.types.ts`)
- [x] Supabase clients: server, browser, middleware session refresh
- [x] Env wiring (`.env.local`, `.env.example` already lists the keys)
- [x] Merge logic for login reconcile (`lib/engine/merge.ts`) + unit tests (D3)
- [x] Auth: magic-link sign-in, callback route, sign-out, session in header
- [x] Profiles: row created on first sign-in, locale stored (written only when it changes)
- [x] Progress sync: background push/pull + login merge (D2/D3) wired into GameClient + Dashboard
- [x] "My adventures" (dashboard) reads account progress when signed in
- [x] Tests green: unit + typecheck + build; e2e (tests/e2e/auth.spec.ts)
- [x] Reviewer-agent pass on the diff (Sonnet) — findings addressed, see log

**M1 is complete.** Review fixes applied: server-enforced furthest-wins (D7), env-unconfigured guards
(D8), push gated behind the first reconcile + reconcile re-reads local and only writes/pushes real
changes, pull errors abort instead of overwriting, "start over" deletes the account save, sign-out clears
local saves (shared-browser leak), open-redirect hardening in the callback, site pages static again (auth
read in the browser), middleware propagates refreshed cookies, `getSession` instead of networked
`getUser` for pushes, DB check constraints + function hygiene. Deferred to later (documented): progress is
client-trusted — M2 entitlements/ranking must not trust `progress.data`.

**Local stack note:** the project lives under `/Applications/...`, which Docker Desktop does not share by
default, so the **Studio** container (and other non-essential services) are excluded at start. Essentials
run: Postgres, Auth (gotrue), REST (postgrest), Kong, Mailpit. Start with:
`supabase start -x studio,realtime,storage-api,imgproxy,edge-runtime,logflare,vector,supavisor`.
To get Studio too, add `/Applications/XAMPP/xamppfiles/htdocs` under Docker Desktop → Settings → Resources
→ File Sharing, then `supabase start` with no excludes. Magic-link emails in dev: Mailpit at
http://127.0.0.1:54324.

### M2 — Entitlements
- [ ] `entitlements` table + RLS
- [ ] Server-enforced: own the adventure + previous chapter solved, in `check.server.ts`
- [ ] Chapters served only after the previous is solved (closes the content-leak gap)

### M3 — Admin dashboard
- [ ] Roles, admin-only area, draft/published, preview — **design shown first**

### M4 — GDPR + newsletter
- [ ] Account deletion, data export, newsletter double opt-in

## Env vars (Phase 2)

Already documented in `.env.example`. For local dev, `supabase start` prints the values to copy into
`.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` — local API URL (e.g. `http://127.0.0.1:54321`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key (safe for the browser)
- `SUPABASE_SERVICE_ROLE_KEY` — server-only; never prefixed with `NEXT_PUBLIC_`

## Log

- 2026-10-31 — Branch created, tracking doc started, Supabase CLI install begun.
- 2026-10-31 — M1 foundation done: local stack up (Studio excluded, see note), `profiles` + `progress`
  migration applied and verified (RLS + policies + auth trigger), DB types generated, browser/server/
  middleware Supabase clients, `.env.local` wired, merge/reconcile logic + tests. Typecheck clean,
  66/66 unit tests pass.
- 2026-10-31 — M1 auth + sync built and verified end-to-end in a browser (sign in via Mailpit link,
  profile/locale written, progress pushed + pulled on a cleared device, sign out). Then a Sonnet reviewer
  audited the diff and found a last-write-wins data-loss path, a no-env crash, a start-over/reconcile
  resurrection, an open redirect, stale-reconcile overwrites, a shared-browser leak and an SSG regression.
  All addressed (migration `20261031094501_harden_progress_sync`, env guards, sync rewrite, callback fix,
  client-derived header auth). 71 unit tests pass; `tests/e2e/auth.spec.ts` (auth + sync) green on a
  production build; typecheck + build clean. **M1 complete.**
