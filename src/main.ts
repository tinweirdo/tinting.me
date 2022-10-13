import { ViteSSG } from 'vite-ssg'
import autoRoutes from '~pages'
import NProgress from 'nprogress'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
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

const scrollBehavior = (from: any, to: any, savedPosition: any) => {
  if (savedPosition)
    return savedPosition
  else
    return { top: 0 }
}

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  ({ router, isClient }) => {
    dayjs.extend(LocalizedFormat)
    if (isClient) {
      router.beforeEach(() => { NProgress.start() })
      router.afterEach(() => { NProgress.done() })
    }
  },
)
