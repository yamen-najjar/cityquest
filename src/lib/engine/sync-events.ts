// The event a reconcile fires when it changed this device's saves. Its own module, so a page that only
// listens for it (the dashboard) does not pull in the Supabase client with sync.ts.
export const SYNCED_EVENT = 'cityquest:synced';
