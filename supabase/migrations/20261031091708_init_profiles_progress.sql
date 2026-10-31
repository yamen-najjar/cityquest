-- Phase 2, Milestone 1: profiles and account-bound game progress.
--
-- Every table has row-level security on, owner-only. Nothing is readable or writable without a policy,
-- so the browser's anon key can only ever touch the signed-in user's own rows.

-- updated_at helper: set on every update, so the client never has to send it.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------------------------------
-- profiles: one row per auth user. Created automatically on sign-up (trigger below).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  locale text not null default 'de' check (locale in ('de', 'en', 'nl', 'ar')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Public profile per auth user; mirror of auth.users for app data.';

alter table public.profiles enable row level security;

create policy "profiles: owner can read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: owner can insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: owner can update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create a profile row automatically when a new auth user is created.
-- SECURITY DEFINER so it runs with the function owner's rights (the trigger fires outside any RLS context).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', null))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------------------------------
-- progress: one row per (user, adventure). The full engine Progress object lives in `data` (jsonb),
-- so the pure game engine and the content model stay untouched (see docs/PHASE2.md, decision D2/D4).
create table public.progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  adventure text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, adventure)
);

comment on table public.progress is 'Account-bound save per adventure; `data` holds the engine Progress object.';

alter table public.progress enable row level security;

create policy "progress: owner can read own"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "progress: owner can insert own"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "progress: owner can update own"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "progress: owner can delete own"
  on public.progress for delete
  using (auth.uid() = user_id);

create trigger progress_set_updated_at
  before update on public.progress
  for each row execute function public.set_updated_at();
