import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1976d2',
        background: '#0f172a',
      },
    },
  },
  plugins: [],
} satisfies Config;
