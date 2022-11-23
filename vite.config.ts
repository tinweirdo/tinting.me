import { resolve } from 'path'
import fs from 'fs-extra'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import SVG from 'vite-svg-loader'
import Icons from 'unplugin-icons/vite'
import Inspect from 'vite-plugin-inspect'
import Components from 'unplugin-vue-components/vite'
import eslint from 'vite-plugin-eslint'
import Pages from 'vite-plugin-pages'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import Markdown from 'vite-plugin-vue-markdown'
import Shiki from 'markdown-it-shiki'
import Anchor from 'markdown-it-anchor'
import LinkAttributes from 'markdown-it-link-attributes'
import TOC from 'markdown-it-table-of-contents'
import TaskLists from 'markdown-it-task-lists'
import slugify from './scripts/slugify'
import excludePosts from './scripts/excludePosts'
import generateSitemap from 'vite-ssg-sitemap'
import env from './scripts/env'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '~/', replacement: `${resolve(__dirname, 'src')}/` },
      { find: 'netlify/', replacement: `${resolve(__dirname, 'netlify')}/` },
    ],
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      'dayjs',
      'dayjs/plugin/localizedFormat',
    ],
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
    }),
    WindiCSS({
      scan: {
        dirs: ['./src'],
        fileExtensions: ['vue', 'js', 'ts', 'md'], // also enabled scanning for js/ts
      },
    }),
    eslint(),
    Inspect(),
    Components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
    SVG({ svgo: false }),
    Icons({ compiler: 'vue3' }),
    Pages({
      extensions: ['vue', 'md'],
      pagesDir: 'pages',
      exclude: excludePosts(),
      importMode: 'async',
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))
        const md = fs.readFileSync(path, 'utf-8')
        const { data, excerpt } = matter(md, { excerpt: (file) => {
          const content = ((file as any).content as string).replace(/<[^>]*>/g, '').replace(/\[\[toc\]\]/g, '')
          ;(file as any).excerpt =  MarkdownIt()
            .render(content)
            .replace(/<[^>]*>/g, '')
            .replace(/\n/g, ' ')
            .replace(/\s+/, ' ')
            .slice(0, 280)
            .concat('...')
          return file
        } })
        route.meta = Object.assign(route.meta || {}, { frontmatter: data, excerpt })
        return route
      },
    }),
    Markdown({
      wrapperComponent: 'markdown',
      wrapperClasses: 'prose m-auto',
      headEnabled: true,
      markdownItOptions: {
        quotes: '""\'\'',
      },
      markdownItSetup(md) {
        md.use(Shiki, {
          theme: {
            dark: 'github-dark',
            light: 'github-light',
          },
        })

        md.use(Anchor, {
          slugify,
          permalink: Anchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: () => ({ 'aria-hidden': 'true' }),
          }),
        })

        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })

        md.use(TOC, {
          includeLevel: [1, 2, 3],
          slugify,
        })

        md.use(TaskLists, { label: false })

      },
    }),
  ],
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ssgOptions: {
    formatting: 'minify',
    format: 'cjs',
    onFinished() {
      generateSitemap({ hostname: env.VITE_SITE_DOMAIN })
    },
  },
})
