import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // The game, the admin console and the legacy pages read these from the channels in globals.css, so
        // the site theme (.theme-site) can point the same names at the Ter plaatse palette.
        navy: {
          DEFAULT: 'rgb(var(--c-navy) / <alpha-value>)',
          800: 'rgb(var(--c-navy-800) / <alpha-value>)',
          700: 'rgb(var(--c-navy-700) / <alpha-value>)',
          600: 'rgb(var(--c-navy-600) / <alpha-value>)',
        },
        gold: {
          DEFAULT: 'rgb(var(--c-gold) / <alpha-value>)',
          soft: 'rgb(var(--c-gold-soft) / <alpha-value>)',
          deep: 'rgb(var(--c-gold-deep) / <alpha-value>)',
        },
        ivory: {
          DEFAULT: 'rgb(var(--c-ivory) / <alpha-value>)',
          dim: 'rgb(var(--c-ivory-dim) / <alpha-value>)',
          mute: 'rgb(var(--c-ivory-mute) / <alpha-value>)',
        },
        danger: '#F08A7E',
        success: '#8FD3A8',
        // Ter plaatse: photo-documentary palette of the site pages.
        ground: { DEFAULT: '#121922', 2: '#18212b' },
        rule: { DEFAULT: '#2a3542', strong: '#4f5c6c' },
        ink: '#e7e9e6',
        muted: '#a3adb7',
        amber: '#f29f3a',
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
        // The pursuer's danger: a slow pulse (at most about one a second, far below the 3-per-second
        // photosensitivity limit). With reduced motion the global rule stops it on its resting frame.
        danger: { '0%,100%': { opacity: '.45' }, '50%': { opacity: '1' } },
      },
      animation: {
        danger: 'danger 2s ease-in-out infinite',
        rise: 'rise .5s ease-out both',
        shimmer: 'shimmer 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
