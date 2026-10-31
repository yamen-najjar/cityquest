-- Phase 2, Milestone 2: entitlements (who may play a paid adventure) and a server-authoritative record
-- of solved chapters (so progression can be gated without trusting the client-mirrored progress.data).
--
-- Both tables have row-level security on and NO client write policies, so the browser's anon key can
-- read only the signed-in user's own rows and can never write either table. Rows are written only by
-- the server through the service role (which bypasses RLS) — see lib/engine/entitlement.server.ts.

-- ---------------------------------------------------------------------------------------------------
-- entitlements: one row per (user, adventure) the player is allowed to play. Demo adventures need no
-- row. Phase 3 (the verified Stripe webhook) inserts a row on a real purchase; `source` records how
-- it was granted. Never written from the browser.
create table public.entitlements (
  user_id uuid not null references auth.users (id) on delete cascade,
  adventure text not null,
  source text not null default 'grant' check (source in ('grant', 'purchase', 'seed')),
  granted_at timestamptz not null default now(),
  primary key (user_id, adventure),
  constraint entitlements_adventure_slug check (adventure ~ '^[a-z0-9-]+$')
);

comment on table public.entitlements is 'Who may play a non-demo adventure. Written only by the service role (never the browser).';

alter table public.entitlements enable row level security;

-- Owner may read their own entitlements. There are deliberately no insert/update/delete policies: with
-- RLS on and no permissive write policy, anon and authenticated cannot write. The service role bypasses
-- RLS, so only the server can grant an entitlement.
create policy "entitlements: owner can read own"
  on public.entitlements for select
  using (auth.uid() = user_id);

-- Defence in depth: RLS already blocks writes (no write policy exists), but Supabase grants anon and
-- authenticated ALL privileges on new public tables by default, so RLS is the only barrier. Revoking
-- the write privileges means a future stray `for all` policy (or RLS being disabled) cannot silently
-- open the table to the browser. The service role keeps its own grants and is unaffected.
revoke insert, update, delete on public.entitlements from anon, authenticated;

-- ---------------------------------------------------------------------------------------------------
-- solves: the server's own record of which chapters a player has actually solved. The answer-check
-- route inserts a row here only when it has itself confirmed a correct answer, so "previous chapter
-- solved" gating reads authoritative data rather than the client's claim (progress.data is untrusted).
create table public.solves (
  user_id uuid not null references auth.users (id) on delete cascade,
  adventure text not null,
  chapter_id text not null,
  solved_at timestamptz not null default now(),
  primary key (user_id, adventure, chapter_id),
  constraint solves_adventure_slug check (adventure ~ '^[a-z0-9-]+$'),
  constraint solves_chapter_id check (chapter_id ~ '^[a-z0-9-]+$' and length(chapter_id) <= 64)
);

comment on table public.solves is 'Server-authoritative solved-chapter log; written only by the service role after it confirms a correct answer.';

alter table public.solves enable row level security;

create policy "solves: owner can read own"
  on public.solves for select
  using (auth.uid() = user_id);

revoke insert, update, delete on public.solves from anon, authenticated;

-- The gating query looks up a player's solved chapters for one adventure; the primary key
-- (user_id, adventure, chapter_id) already serves that (user_id, adventure) prefix, so no extra index.
