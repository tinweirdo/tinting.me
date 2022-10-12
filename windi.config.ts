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
    extend: {
      colors: {
      },
    },
    fontSize: {
      sm: ['14px', '20px'],
      base: ['16px', '24px'],
      lg: ['20px', '28px'],
      xl: ['24px', '32px'],
    },
  },
  plugins: [form],
})
