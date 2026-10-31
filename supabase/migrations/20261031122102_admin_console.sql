-- Phase 2, Milestone 3: admin console (operational — Option 2).
--
-- Two tables, same security posture as M2: RLS on, owner/none read, NO client write policies, so only
-- the server (service role) writes them. Admin status can never be set from the browser.

-- ---------------------------------------------------------------------------------------------------
-- admin_users: membership = admin. No column on `profiles` (which a client can self-update), so admin
-- rights cannot be self-elevated. Writes are service-role-only; the first admin is bootstrapped by the
-- trigger below, and further admins are added from the console (service role).
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);

comment on table public.admin_users is 'Membership grants admin rights. Written only by the service role; never by the browser.';

alter table public.admin_users enable row level security;

-- An admin may confirm their own membership (used by the server to read the session user's row). No
-- write policies exist, so anon/authenticated cannot grant themselves admin.
create policy "admin_users: can read own row"
  on public.admin_users for select
  using (auth.uid() = user_id);

revoke insert, update, delete on public.admin_users from anon, authenticated;

-- Bootstrap the first admin. This promotes one known email to admin whenever that account is created
-- (works on a fresh local reset and on the cloud project alike). Additional admins are added from the
-- console. SECURITY DEFINER + empty search_path, mirroring handle_new_user().
create or replace function public.handle_bootstrap_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email = 'wessamnajjar654@gmail.com' then
    insert into public.admin_users (user_id) values (new.id) on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

revoke execute on function public.handle_bootstrap_admin() from public, anon, authenticated;

create trigger on_auth_user_created_bootstrap_admin
  after insert on auth.users
  for each row execute function public.handle_bootstrap_admin();

-- ---------------------------------------------------------------------------------------------------
-- adventure_state: the admin's operational overlay for an adventure (publish state, price, tier,
-- availability). Stories stay authored in code; this holds only the business fields the console edits.
-- Admin-read/write via the service role only (no public policy); the public catalogue is unaffected
-- until a deploy/rebuild consumes the state (documented in docs/PHASE2-M3-M4-plan.md).
create table public.adventure_state (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  status text not null default 'published' check (status in ('draft', 'published')),
  price_cents integer check (price_cents is null or price_cents >= 0),
  tier text check (tier is null or tier in ('standard', 'premium')),
  available boolean not null default true,
  updated_at timestamptz not null default now()
);

comment on table public.adventure_state is 'Admin operational overlay per adventure; written only by the service role.';

alter table public.adventure_state enable row level security;
-- No select/insert/update/delete policies: only the service role (the admin console on the server)
-- touches this table.
revoke insert, update, delete on public.adventure_state from anon, authenticated;

create trigger adventure_state_set_updated_at
  before update on public.adventure_state
  for each row execute function public.set_updated_at();
