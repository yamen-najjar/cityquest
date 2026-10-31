-- M4 review: the confirm/unsubscribe token identifies exactly one subscriber, so make its index unique
-- (defence in depth against a duplicate token ever being written).
drop index if exists public.newsletter_subscribers_token_idx;
create unique index newsletter_subscribers_token_idx on public.newsletter_subscribers (token);
