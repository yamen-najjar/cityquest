/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  // Location is asked for only in Phase 4; until then the browser never offers it to the page.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
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
