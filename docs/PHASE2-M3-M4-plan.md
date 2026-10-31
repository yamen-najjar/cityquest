# Phase 2 — M3 (admin) & M4 (GDPR + newsletter) — worked-out plan

Design-first: this is the plan + the decisions to approve **before** building. The admin UI also has a
visual mockup (shared separately as an artifact). Nothing here is built yet. Companion to `PHASE2.md`.

Guiding rules carried over: RLS on every table, owner-only by default; **admin writes go through the
service role on the server, never the browser** (D5); the site still boots with Supabase unconfigured
(D8); KISS/YAGNI — build what the milestone needs, not speculative machinery.

---

## M3 — Admin dashboard

### The one decision to make first: how much content lives in the database?

The content model (`src/content/*`) is unusually rich and fully type-checked: 3D scenes, cipher wheels,
interrogations, deductions, per-puzzle hints, 4-locale i18n with translation tables, server-only answer
keys. Today it is authored in TypeScript and compiled in — which gives type safety, git history, review,
and SSG for free.

| Option | What the admin edits | Build size | Trade-off |
|---|---|---|---|
| **1 — Full CMS** | Everything (cities, adventures, chapters, puzzles, scenes, answers) in DB tables, edited via forms | **Very large** | Non-devs can write stories, but we rebuild the entire rich/typed model as DB schema + forms, lose compile-time safety on content, and rework the content loaders while keeping SSG/offline. |
| **2 — Operational console (recommended)** | DB holds only *operational* state: publish status, price/tier, availability, entitlement grants, orders, players, newsletter. Stories stay code-authored. | **Moderate** | Content authored by devs in TS (its strength today); admin manages the *business* around it. Covers "roles, admin-only area, draft/published, preview" without a CMS rewrite. |
| **3 — Hybrid** | Option 2 + admin can override a small set of "soft" content fields (price, tagline, meeting point) per adventure | Moderate+ | Some non-dev editing of safe fields; more surface than 2. |

**Recommendation: Option 2 now.** It delivers the roadmap's admin dashboard (roles, admin-only area,
draft/published, preview) at a sane size, keeps the content model's type safety, and leaves a true CMS
as a later phase if/when non-dev story editing is actually needed. The sections below assume Option 2
(the parts that change for 1/3 are noted).

### Roles & access (D11, D12)

- **D11 — admin identity via an `admin_users` table, never a column on `profiles`.** A `role` column on
  `profiles` could be self-elevated by a client (`profiles` has an owner-update policy for locale). An
  `admin_users(user_id)` table with **no client write policy** (service-role-only, exactly like
  `entitlements`) means admin status can never be set from the browser. First admin is seeded via
  migration/CLI.
- **D12 — the admin area is server-gated and invisible to non-admins.** Pages live at `/admin/*`
  (outside `[locale]`, English-only, `robots: noindex`). Every admin page and action resolves
  `getUser()` + `admin_users` membership (service role) server-side; a non-admin gets **404** (not 403),
  so the area's existence isn't advertised. Middleware also blocks `/admin` without a session.
- All admin **writes** use the service role in a server action / route handler. The browser never holds
  elevated rights.

### Schema (new)

```
admin_users (user_id uuid pk → auth.users on delete cascade, added_at)
  RLS on; owner-read only; no client writes (service-role only).

adventure_state (slug text pk, status 'draft'|'published', price_cents int, tier, available bool, updated_at)
  The DB overlay for operational fields. Static content supplies defaults; this row, when present,
  wins. Public read of published rows; admin-only write (service role).

orders (id, user_id, adventure, amount_cents, status, provider, created_at)   -- Phase 3 fills this via Stripe;
  M3 only reads/display + lets an admin grant a manual entitlement pre-Stripe. RLS owner-read; admin reads all via service role.
```
(`entitlements`, `solves`, `profiles`, `progress` already exist from M1/M2.)

### Screens (see mockup)

1. **Overview** — KPIs: players, confirmed newsletter subs, adventures published, entitlements granted,
   recent sign-ins. Read-only.
2. **Adventures** — list from static content joined with `adventure_state`; per row: status
   (draft/published) toggle, price/tier, availability; **Preview draft** opens the play page in a draft
   context. (Option 3 would add inline editing of soft fields here.)
3. **Entitlements & orders** — see who owns what; **grant/revoke** an entitlement by email (pre-Stripe
   manual access; writes `entitlements` via service role with `source='grant'`).
4. **Players** — list profiles (email, locale, created), per-player progress/solves (read-only).
5. **Newsletter** (shared with M4) — subscribers with status, export CSV, manual unsubscribe.

### Draft/published + preview

- `published` adventures appear in the public catalog/sitemap. `draft` ones are hidden publicly but an
  admin can open `/admin/preview/<slug>` (server-gated) to play them before publishing.
- Build stays SSG for published content; draft preview is a dynamic, admin-only route.

### M3 tests
- Unit: access resolver (admin vs non-admin → 404), `adventure_state` overlay precedence, grant/revoke.
- Live/RLS: non-admin cannot read `admin_users`/all players; cannot write `adventure_state`; service
  role can. Reviewer (Sonnet) pass on the diff, as with M1/M2.

---

## M4 — GDPR + newsletter

### Account deletion (right to erasure)

- **Account page → "Delete my account"**, with an explicit, irreversible confirmation (type email to
  confirm). Server route uses the service role: `auth.admin.deleteUser(user.id)`.
- All user tables FK `auth.users on delete cascade` → `profiles`, `progress`, `entitlements`, `solves`
  are removed automatically; the newsletter row (keyed by email) is deleted/anonymised in the same
  action. Client then runs the existing `signOutAndClear()` to wipe localStorage.
- **D13 — deletion is server-side via `auth.admin.deleteUser`, cascade-verified in a test**, so no user
  data survives in any table.

### Data export (right to access / portability)

- **Account page → "Download my data"** → authenticated server route gathers the user's own rows
  (profile, progress, entitlements, solves, newsletter status) and returns a JSON file download.
- Own data only (filtered by the verified session user id). No admin needed.

### Newsletter with double opt-in (D14)

```
newsletter_subscribers (
  email text pk, status 'pending'|'confirmed'|'unsubscribed',
  token uuid, locale, source, consent_at, confirmed_at, unsubscribed_at
)
  RLS on; NO public read (email is PII); all access via server (service role). Admin views in dashboard.
```

- **Flow:** submit email (+ privacy-policy consent checkbox, `consent_at` stored) → row `pending` +
  **confirmation email** with a tokened link → click `/newsletter/confirm?token=…` → `confirmed`. Every
  email carries an unsubscribe link → `/newsletter/unsubscribe?token=…` → `unsubscribed`. Double opt-in
  = the GDPR-clean consent record.
- **Abuse:** signup route rate-limited; token is single-purpose; re-submitting a pending email re-sends,
  doesn't duplicate.
- **Email sending (hosting-aware):** dev reads the mail from **Mailpit** (same as magic links). Prod
  uses a provider behind an env var (e.g. `RESEND_API_KEY` / SMTP) — an abstraction `sendEmail()` so the
  provider is a config change, not a rewrite (mirrors the cloud-ready approach in D1/D8). If unset, the
  newsletter UI degrades gracefully (signup disabled with a notice), never 500s.
- **D14 — consent is explicit + double-opt-in; the subscribers table is never publicly readable.**

### Privacy policy
- The existing `/legal/privacy` page is updated to list exactly what is collected (account email,
  progress, entitlements, newsletter) and state the deletion/export rights and how to use them.

### M4 tests
- Unit: token flow state machine (pending→confirmed→unsubscribed; re-submit idempotent); export shape;
  deletion cascade (against the live DB).
- Live/RLS: `newsletter_subscribers` not readable by anon/authenticated; confirm/unsubscribe only via a
  valid token. Reviewer (Sonnet) pass.

---

## Suggested order & checkpoints
1. **M3 scope decision** (Option 1 / 2 / 3) — *needs your pick* (recommend 2).
2. Build M3: `admin_users` + access gate + overview + adventures/publish + entitlement grant + players.
3. Build M4: deletion + export, then newsletter double opt-in + privacy copy.
4. Each milestone: unit + live/RLS tests, Sonnet review, commit on `phase-2-backend` (no push to main).

## Open decisions for you
- **M3 scope**: Option 2 (recommended), 1, or 3?
- **Admin area**: English-only at `/admin` outside i18n (recommended) — ok?
- **First admin**: seed your account (`wessamnajjar654@gmail.com`) as the first `admin_users` row?
- **Newsletter email provider** for later (Resend/SMTP/other) — can decide at hosting time; dev uses Mailpit.
