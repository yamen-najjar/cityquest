-- Phase 2, Milestone 4: newsletter subscribers (double opt-in).
--
-- Email is personal data, so this table is never readable or writable from the browser: RLS is on with
-- NO policies, and all privileges are revoked from anon/authenticated. Only the server (service role)
-- reads or writes it — the signup form, the tokened confirm/unsubscribe links, the admin console, and a
-- user's own data export/deletion.

create table public.newsletter_subscribers (
  email text primary key check (email = lower(email) and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'unsubscribed')),
  token uuid not null default gen_random_uuid(),
  locale text not null default 'de' check (locale in ('de', 'en', 'nl', 'ar')),
  source text,
  consent_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  updated_at timestamptz not null default now()
);

comment on table public.newsletter_subscribers is 'Double opt-in newsletter list. Email is PII: service-role access only, no client policies.';

alter table public.newsletter_subscribers enable row level security;
-- No policies at all. The service role bypasses RLS; everyone else is denied.
revoke all on public.newsletter_subscribers from anon, authenticated;

-- Look up a subscriber by their confirm/unsubscribe token.
create index newsletter_subscribers_token_idx on public.newsletter_subscribers (token);

create trigger newsletter_subscribers_set_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();
