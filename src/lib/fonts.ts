import localFont from 'next/font/local';

// Declared once and reused by every root layout (the locale site and the admin console), so the fonts
// are loaded a single time rather than per layout.
//
// The fonts ship with the repo (src/fonts, variable woff2 from Fontsource, SIL Open Font License; the
// licences sit next to them) instead of next/font/google, which downloads them from Google on every
// build: when Google answered oddly the build failed ("Cannot read properties of null"), at random.
export const display = localFont({
  src: [
    { path: '../fonts/cormorant-garamond-latin-wght-normal.woff2', weight: '300 700', style: 'normal' },
    { path: '../fonts/cormorant-garamond-latin-wght-italic.woff2', weight: '300 700', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});
export const sans = localFont({
  src: '../fonts/inter-latin-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
export const arabic = localFont({
  src: '../fonts/noto-kufi-arabic-arabic-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-arabic',
  display: 'swap',
  fallback: ['Tahoma', 'sans-serif'],
});
