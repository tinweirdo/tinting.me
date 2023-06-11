import dayjs from 'dayjs'
import md5 from 'md5'
import { defaultWindow, isClient } from '@vueuse/core'

export const formatDate = (d: string | Date) => dayjs(d).format('MMM D, YYYY')

export const navigateToAnchor = (hash?: string) => {
  if (hash) window.history.replaceState({}, '', hash)
  if (location.hash) {
    const headerHeight = 56
    const viewportTop = defaultWindow?.document.documentElement.scrollTop ?? 0
    const elTop = document.querySelector(decodeURIComponent(location.hash))?.getBoundingClientRect().top ?? 0
    defaultWindow?.scrollTo({ top: viewportTop + elTop - headerHeight - 16, behavior: 'smooth' })
  }
}

const GRAVATAR_CDN = 'https://dn-qiniu-avatar.qbox.me/avatar/'

export const getGravatar = (email: string) => `${GRAVATAR_CDN}${md5(email.trim().toLowerCase())}?d=identicon`

export const isSupportWebp = (() => {
  if (isClient) {
    return document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp')
  }
  return false
})()

export const PLACEHOLDER_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
