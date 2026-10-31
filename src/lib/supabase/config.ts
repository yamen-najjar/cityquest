// Phase 1 ran with no backend, and the site must still boot with no Supabase configured (a fresh clone,
// CI, or a preview deploy without env vars). Everywhere that touches Supabase checks this first and
// degrades to signed-out, offline-only behaviour instead of throwing.
export function isSupabaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

// Server-only: the service role key lets the server read/write past RLS (entitlement checks, recording
// a confirmed solve). Without it, paid-adventure checks fail closed (see entitlement.server.ts).
export function isAdminConfigured(): boolean {
  return isSupabaseConfigured() && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}
