# Phase 2 — Real backend

Tracking document for Phase 2. Kept in sync with the code: every decision and every completed step is
recorded here so the work stays auditable and reversible.

**Branch:** `phase-2-backend` · **Status:** Milestone 2 complete (reviewed) · **Started:** 2026-10-31

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
| D9 | Entitlement + order gating applies to **paid (non-demo) adventures only**; demo stays open/offline | Demo adventures must keep working signed-out and offline (D2), and their page stays SSG. The check API gates only `!isDemo` adventures (account + ownership + previous chapter solved). Both current adventures are `isDemo`, so this is dormant groundwork until a purchasable adventure exists. Full per-chapter content *delivery* (not shipping later chapters to the browser at all) is deferred to Phase 3, when purchases make it necessary — nothing is leaked to a paying context before then (YAGNI). |
| D10 | A **server-authoritative** `solves` table; gating never trusts `progress.data` | The M1 review flagged that `progress.data` is client-trusted. The answer-check route writes a `solves` row only when it has itself confirmed a correct answer; order gating reads `solves`. `entitlements` and `solves` have no client write policies, so only the service role (server) writes them; owners can read their own. Paid checks fail **closed** when no service role is configured. |

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

### M2 — Entitlements (complete)
- [x] `entitlements` + `solves` tables + RLS (owner-read, no client writes; service-role-only writes) — migration `20261031112616_entitlements_and_solves`
- [x] Server-enforced in the check route: demo = open; paid = own the adventure + every earlier chapter solved, both read from the DB (`lib/engine/entitlement.server.ts`), answer compared only after authorising
- [x] Server-authoritative solve recording (D10): a solve is written only after the server confirms correctness; gating reads `solves`, never `progress.data`
- [x] Service-role admin client (`lib/supabase/admin.ts`), `isAdminConfigured()` guard; paid checks fail closed with no backend
- [x] Tests: 85 unit (resolveGuess + entitlement gating branches + record-failure + DB-safe chapter-id invariant, Supabase mocked); RLS invariants verified live (anon cannot read/write either table, service role can, slug check constraint holds); typecheck + build clean, `play/[slug]` still SSG
- [x] Reviewer-agent pass (Sonnet) on the M2 diff — no HIGH/exploitable bypass; fixes applied (see below)
- Deferred to Phase 3 (documented, D9): full per-chapter content *delivery* for paid adventures (not shipping later chapters to the browser) + an end-to-end paid-flow e2e, which needs a real purchasable (non-demo) adventure to exist first.

**M2 review (Sonnet) — no HIGH, no exploitable gating/RLS bypass. Fixed:** the solve write now
reports failure and the route returns 503 instead of a false `correct:true` (was a silent soft-lock
risk); `revoke insert/update/delete` on both tables from anon/authenticated (defence-in-depth, so RLS
is no longer the only barrier — verified the grants are gone); dropped the redundant
`solves_user_adventure_idx` (the PK prefix serves it); moved `isAdminConfigured()` into the
`server-only` `admin.ts` (out of browser-reachable `config.ts`); added a unit test asserting chapter
ids satisfy the DB `chapter_id` check constraint; the paid path is wrapped in try/catch → 503.
**Accepted/deferred:** per-user guess throttling on the *current* chapter (an owner can brute-force a
short code with unlimited guesses) — order gating stops skipping ahead but not this; deferred to Phase 3
with the first purchasable adventure (D9). Dormant now (all adventures are demo).

### M3 — Admin dashboard (complete)
Design shown first (mockup + `docs/PHASE2-M3-M4-plan.md`), Option 2 (operational console) chosen.
- [x] `/admin`, English-only, own root layout, `robots:noindex`, server-gated (`requireAdmin` → 404 for non-admins)
- [x] `admin_users` table (service-role-write-only); admin is granted **only** by the service role (D11)
- [x] `adventure_state` overlay table; Overview, Players, Access (grant/revoke by email), Adventures (publish toggle + draft preview)
- [x] All reads/writes via the service role in `lib/admin/data.ts`; server actions re-check `requireAdmin` and validate inputs
- [x] Verified live (sign-in, every screen, grant + toggle writing the DB); 89 unit tests; typecheck + build
- [x] Reviewer-agent pass (Sonnet) — findings fixed (see below)

**M3 review (Sonnet) — no unconditional HIGH; the bootstrap path was the real risk. Fixed:** removed
the promote-by-email signup trigger (a stranger could seize admin by pre-registering the owner's email
with confirmations off, or an unconfirmed password account) — admin is now granted only by the service
role (CLI/console), and `requireAdmin` also requires a confirmed email; replaced `auth.admin.listUsers()`
(first-1000 cap → wrong counts and failed email lookups) with `profiles` (email mirrored on the profile),
exact `count` headers, and email lookup by `profiles.email`; grant no longer overwrites an existing
row's provenance (ignoreDuplicates); admin preview/list now use an unfiltered `allAdventures` so content
drafts show; server actions validate slug/UUID; `revoke all … grant select` + `(select auth.uid())`;
middleware forwards refreshed cookies; `getAdminUser` wrapped in `React.cache`; grant form keeps the
email on error. **Deferred (documented):** making the publish toggle change the public catalogue (SSG →
next deploy); an audit trail (who granted/revoked); preview of a *paid* adventure needs a self-grant.

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
- 2026-10-31 — M2 built (Option A, chosen with the user: secure the API now, keep pages offline-first).
  Added `entitlements` + server-authoritative `solves` tables (RLS owner-read, service-role-only writes;
  migration `20261031112616`), a service-role admin client, and `lib/engine/entitlement.server.ts` that
  gates paid-adventure answers on ownership + previous-chapter-solved and records a solve only after the
  server confirms it. `check.server.ts` split into `resolveGuess` (pure) + `checkAnswer`; the check route
  branches demo (open, offline) vs paid (authorised). 82 unit tests pass; RLS invariants verified live;
  build keeps `play/[slug]` SSG. Reviewer pass next.
- 2026-10-31 — M2 reviewed (Sonnet): no HIGH, no exploitable gating/RLS bypass. Applied fixes — solve
  write reports failure → route returns 503 (was a silent soft-lock), `revoke` writes from
  anon/authenticated on both tables (verified), dropped the redundant index, moved `isAdminConfigured`
  into `server-only` `admin.ts`, added a DB-safe chapter-id invariant test, wrapped the paid path in
  try/catch → 503. Guess throttling on the current chapter accepted as a Phase 3 item (D9). 85 unit
  tests pass; grants/index re-verified live; typecheck + build clean. **M2 complete.**
- 2026-10-31 — M3 built (Option 2, operational console) and verified live (admin sign-in, Overview,
  Players, Access grant/revoke, Adventures publish toggle + draft preview). Migration `20261031122102`
  (`admin_users` + `adventure_state`). Then a Sonnet review flagged the bootstrap-by-email trigger as a
  takeover risk and the listUsers 1000-cap as a correctness bug; hardening migration `20261031124521`
  removes the trigger (admin is service-role-granted only; CLI bootstrap), mirrors email onto `profiles`,
  and tightens grants. Code switched to profiles-based reads, provenance-preserving grants, input
  validation, cached admin check. 89 unit tests; typecheck clean. **M3 complete.**
