import { ViteSSG } from 'vite-ssg'
import { defaultWindow, isClient } from '@vueuse/core'
import autoRoutes from '~pages'
import NProgress from 'nprogress'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { plugin as messagePlugin } from '~/plugins/message'
import { plugin as lightboxPlugin } from '~/plugins/lightbox'
import { DEV } from './env'
import App from './App.vue'

import 'virtual:windi.css'
import './style.less'

const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith('/')
      ? `${i.path}index.html`
      : `${i.path}.html`,
  }
})

NProgress.configure({ showSpinner: false })

if (isClient && DEV) {
  // remove referrer of resources only for local dev
  defaultWindow?.document.querySelector('meta[name=referrer]')?.setAttribute('content', 'never')
}

const scrollBehavior = (from: any, to: any, savedPosition: any) => {
  if (savedPosition)
    return savedPosition
  else
    return { top: 0 }
}

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  ({ router, isClient, app }) => {
    dayjs.extend(LocalizedFormat)
    if (isClient) {
      app.use(messagePlugin)
      app.use(lightboxPlugin)
      router.beforeEach(() => { NProgress.start() })
      router.afterEach(() => { NProgress.done() })
    }
  },
)
