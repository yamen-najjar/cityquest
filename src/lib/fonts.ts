import { Cormorant_Garamond, Inter, Noto_Kufi_Arabic } from 'next/font/google';

// Declared once and reused by every root layout (the locale site and the admin console), so the fonts
// are loaded a single time rather than per layout.
export const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});
export const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
export const arabic = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});
