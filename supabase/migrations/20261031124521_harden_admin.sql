-- Phase 2, M3 review hardening.

-- 1) Remove the bootstrap-by-email trigger. It promoted whoever was inserted with the owner's email,
--    which (with email confirmations off, or by pre-registering an unconfirmed password account) let a
--    stranger seize admin before the owner signed in. Admin is now granted ONLY by the service role:
--    the first admin is seeded with a one-off CLI/SQL insert once the account exists and is confirmed,
--    e.g. (run after the owner has signed in):
--      insert into public.admin_users (user_id)
--      select id from auth.users where email = '<owner-email>' and email_confirmed_at is not null;
--    Further admins are added from the console. (See docs/PHASE2-M3-M4-plan.md, D11.)
drop trigger if exists on_auth_user_created_bootstrap_admin on auth.users;
drop function if exists public.handle_bootstrap_admin();

-- 2) Mirror the account email onto the profile. The admin console reads players, maps entitlements and
--    looks up an account to grant by email through `profiles` instead of auth.admin.listUsers(), which
--    only returned the first 1000 users and made counts and email lookups wrong past that. `profiles`
--    has one row per user and is service-role/owner scoped, so the email is not newly exposed.
alter table public.profiles add column if not exists email text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', null), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Backfill existing profiles.
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;

-- 3) Tighten table privileges on the admin tables: revoke everything from the browser roles, then grant
--    back only the one read the app needs. Leaves no TRUNCATE/REFERENCES lingering, and makes RLS not
--    the sole barrier. Also switch the admin_users policy to the cached (select auth.uid()) form.
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

drop policy if exists "admin_users: can read own row" on public.admin_users;
create policy "admin_users: can read own row"
  on public.admin_users for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.adventure_state from anon, authenticated;
