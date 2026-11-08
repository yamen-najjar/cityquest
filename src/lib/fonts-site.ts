import localFont from 'next/font/local';

// Schibsted Grotesk, the face of the site pages (the game and the admin console keep Inter and Cormorant).
// Fontsource ships it in two files that cover different ranges, so there are two families, each limited by
// unicode-range (next/font wants literal values, hence the long strings); the site theme lists both. Imported only by the (site) layout, so the game never loads it.
export const groteskLatin = localFont({
  src: '../fonts/schibsted-grotesk-latin-wght-normal.woff2',
  weight: '400 900',
  variable: '--font-grotesk-latin',
  display: 'swap',
  declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD' }],
  adjustFontFallback: false,
  fallback: [],
});
export const groteskLatinExt = localFont({
  src: '../fonts/schibsted-grotesk-latin-ext-wght-normal.woff2',
  weight: '400 900',
  variable: '--font-grotesk-latin-ext',
  display: 'swap',
  preload: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF' }],
  adjustFontFallback: false,
  fallback: [],
});
