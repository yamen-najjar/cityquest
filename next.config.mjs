/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  // Phase 4: the page itself may ask for location (GPS confirmation) and the camera (QR scan), but only
  // on this origin and only when the player taps "I'm here" / "Scan". Microphone stays blocked.
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(self)' },
  // The parts of a Content Security Policy that cannot break the app: no plugins, no <base> hijack, forms
  // only post back here, no framing. A full script/style/connect policy needs nonces for Next's inline
  // scripts plus the map, Supabase and asset origins; it is listed as an open item in docs/SECURITY.md.
  { key: 'Content-Security-Policy', value: "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" },
];

const nextConfig = {
  // This project is the workspace root. Pin it so Next does not pick an outer lockfile (there is one in
  // the parent htdocs folder), which would otherwise skew output file tracing for deployment.
  outputFileTracingRoot: import.meta.dirname,
  // The browser tests build into their own folder, so they can run while `npm run dev` is open.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
