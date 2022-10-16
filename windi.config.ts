import { defineConfig } from 'windicss/helpers'
import form from 'windicss/plugin/forms'

export default defineConfig({
  darkMode: 'class',
  extract: {
    include: ['src/**/*.{vue,html,ts,md}', 'pages/**/*.md'],
    exclude: ['node_modules', '.git'],
  },
  attributify: {
    prefix: 'w:',
  },
  theme: {
    screens: {
      '<w-content': { raw: '(max-width: calc(48rem + 48px))' },
    },
    extend: {
      colors: {
        'bg-base': 'var(--bg-base)',
        'bg-deep': 'var(--bg-deep)',
        'bg-deeper': 'var(--bg-deeper)',
        'accent': 'var(--color-accent)',
        'border': 'var(--color-border)',
        'lite': 'var(--text-lite)',
        'base': 'var(--text-base)',
        'deep': 'var(--text-deep)',
        'deeper': 'var(--text-deeper)',
      },
    },
    fontSize: {
      sm: ['14px', '20px'],
      base: ['16px', '24px'],
      lg: ['20px', '28px'],
      xl: ['24px', '32px'],
    },
  },
  shortcuts: {
    'w-content': 'max-w-48rem mx-auto !<w-content:mx-24px',
  },
  plugins: [form],
})
