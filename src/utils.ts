import dayjs from 'dayjs'
import md5 from 'md5'
import { defaultWindow } from '@vueuse/core'

export const formatDate = (d: string | Date) => dayjs(d).format('MMM D, YYYY')

export const navigateToAnchor = () => {
  console.log('navigateToAnchor', location.hash)
  if (location.hash) {
    const headerHeight = 56
    const viewportTop = defaultWindow?.document.documentElement.scrollTop ?? 0
    const elTop = document.querySelector(decodeURIComponent(location.hash))?.getBoundingClientRect().top ?? 0
    defaultWindow?.scrollTo({ top: viewportTop + elTop - headerHeight - 16, behavior: 'smooth' })
  }
}

const GRAVATAR_CDN = 'https://dn-qiniu-avatar.qbox.me/avatar/'

export const getGravatar = (email: string) => `${GRAVATAR_CDN}${md5(email.trim().toLowerCase())}?d=identicon`
