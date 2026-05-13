import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        saas: {
          canvas: '#F4F5F7',
          sidebar: '#121417',
          accent: '#D946EF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
      },
      keyframes: {
        'poker-sheen': {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(320%)' },
        },
      },
      animation: {
        'poker-sheen': 'poker-sheen 1.15s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config

