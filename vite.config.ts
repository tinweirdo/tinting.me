import { resolve } from 'path'
import fs from 'fs-extra'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Inspect from 'vite-plugin-inspect';
import Components from 'unplugin-vue-components/vite';
import Markdown from 'vite-plugin-vue-markdown';
import Pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '~/', replacement: `${resolve(__dirname, 'src')}/` }
    ],
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
    ],
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
    }),
    Inspect(),
    Components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
    Pages({
      extensions: ['vue', 'md'],
      pagesDir: 'pages',
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))

        // if (!path.includes('projects.md')) {
        //   const md = fs.readFileSync(path, 'utf-8')
        //   const { data } = matter(md)
        //   route.meta = Object.assign(route.meta || {}, { frontmatter: data })
        // }

        return route
      },
    }),

    Markdown({
      wrapperComponent: 'post',
      wrapperClasses: 'prose m-auto',
      headEnabled: true,
      markdownItOptions: {
        quotes: '""\'\'',
      },
    }),
  ],
  ssgOptions: {
    formatting: 'minify',
    format: 'cjs',
  },
});
