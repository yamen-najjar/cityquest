import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0B1324', 800: '#142238', 700: '#1C2E4A', 600: '#273C5E' },
        gold: { DEFAULT: '#DDB66A', soft: '#E8CC93', deep: '#B8914A' },
        ivory: { DEFAULT: '#F8F4EC', dim: '#C9C3B8', mute: '#9AA3B5' },
        danger: '#F08A7E',
        success: '#8FD3A8',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(221,182,106,.35), 0 10px 40px -10px rgba(221,182,106,.35)',
        card: '0 20px 50px -20px rgba(0,0,0,.6)',
      },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
        shimmer: { '0%,100%': { opacity: '.55' }, '50%': { opacity: '1' } },
      },
      animation: {
        rise: 'rise .5s ease-out both',
        shimmer: 'shimmer 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
