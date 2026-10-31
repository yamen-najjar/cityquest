-- Phase 2, Milestone 1 hardening (from the M1 review).
--
-- The big one: make "furthest save wins" a server-side invariant, so a stale device can never overwrite
-- newer account progress no matter how client timing races. Plus function hygiene and shape constraints.

-- 1. set_updated_at: pin search_path (Supabase linter) and keep it SECURITY INVOKER (the default).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- 2. Lock down the trigger functions: they are only ever called by their triggers, never directly.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- 3. Shape and size constraints on progress. `data` is the engine Progress object; keep it bounded and
--    keep the row's adventure column consistent with the blob so neither can be spoofed apart.
alter table public.progress
  add constraint progress_adventure_slug check (adventure ~ '^[a-z0-9-]+$'),
  add constraint progress_data_matches_adventure check (data->>'adventure' = adventure),
  add constraint progress_data_size check (octet_length(data::text) < 65536);

alter table public.profiles
  add constraint profiles_display_name_len check (display_name is null or char_length(display_name) <= 120);

-- 4. "Furthest wins" as a server invariant. On update, if the existing row is at least as far along as the
--    incoming one, keep the existing data (ignore the regression). "Further" mirrors lib/engine/merge.ts:
--    finished (a decision was made) beats unfinished, then more solved chapters, then a later lastActiveAt;
--    an exact tie keeps what is already stored. Applies to the UPDATE arm of upsert; a genuine first insert
--    is untouched, and DELETE (used by "start over") is untouched.
create or replace function public.keep_furthest_progress()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  old_finished boolean := (old.data->>'decision') is not null;
  new_finished boolean := (new.data->>'decision') is not null;
  old_solved int := coalesce(jsonb_array_length(old.data->'solved'), 0);
  new_solved int := coalesce(jsonb_array_length(new.data->'solved'), 0);
  old_active numeric := coalesce((old.data->>'lastActiveAt')::numeric, 0);
  new_active numeric := coalesce((new.data->>'lastActiveAt')::numeric, 0);
  keep_old boolean;
begin
  if old_finished <> new_finished then
    keep_old := old_finished;
  elsif old_solved <> new_solved then
    keep_old := old_solved > new_solved;
  else
    keep_old := old_active >= new_active;
  end if;

  if keep_old then
    new.data := old.data;
    new.updated_at := old.updated_at;
  end if;
  return new;
end;
$$;

revoke execute on function public.keep_furthest_progress() from public, anon, authenticated;

-- Runs before set_updated_at (trigger order is alphabetical: 'progress_keep_furthest' < 'progress_set_updated_at').
create trigger progress_keep_furthest
  before update on public.progress
  for each row execute function public.keep_furthest_progress();
