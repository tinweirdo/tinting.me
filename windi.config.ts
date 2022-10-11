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
  },
  plugins: [form],
})
