-- Security fix: a player could rewrite the email on their own profile.
--
-- The "profiles: owner can update own" / "can insert own" policies allow any column, and profiles.email
-- (added in 20261031124521_harden_admin) is what the admin console matches when it grants an adventure
-- by email. A signed-in player could set their profile email to a customer's address and receive that
-- customer's access (or make the lookup fail for the real account). The app itself only ever updates
-- `locale`, so the fix is to let the browser roles touch only the harmless columns, keep `email` written
-- by the server alone, and keep it in step with the auth account.
--
-- Down (to undo): grant insert, update on public.profiles to authenticated;
--                 drop trigger if exists on_auth_user_email_changed on auth.users;
--                 drop function if exists public.handle_user_email_change();

-- 1) Column privileges: RLS still decides which row; these decide which columns.
revoke insert, update on public.profiles from anon, authenticated;
grant update (display_name, locale) on public.profiles to authenticated;
grant insert (id, display_name, locale) on public.profiles to authenticated;

-- 2) Keep the mirrored email current when the account email changes (the insert trigger only sets it once).
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

revoke execute on function public.handle_user_email_change() from public, anon, authenticated;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- 3) Repair: undo any email a client may already have written.
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is distinct from u.email;
