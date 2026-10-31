// Phase 1 ran with no backend, and the site must still boot with no Supabase configured (a fresh clone,
// CI, or a preview deploy without env vars). Everywhere that touches Supabase checks this first and
// degrades to signed-out, offline-only behaviour instead of throwing.
export function isSupabaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}
