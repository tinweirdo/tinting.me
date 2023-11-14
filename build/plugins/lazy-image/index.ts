import { createFilter, FilterPattern } from '@rollup/pluginutils'
import { Plugin } from 'vite'
import MagicString from 'magic-string'
import fetch from 'node-fetch'

interface ImageInfo {
  width: number
  height: number
  format: string
}

const cache = new Map<string, ImageInfo>()

const getImageInfo = (url: string) => {
  if (cache.has(url)) return Promise.resolve(cache.get(url)!)
  return fetch(url + '?imageInfo')
    .then((res) => res.json())
    .then((info: ImageInfo) => {
      cache.set(url, info)
      return info
    })
}

export default function lazyImage(): Plugin {
  const filter = createFilter(['**/*.vue', '**/*.md'])
  const regx = /https?:\/\/static\.tinweirdo\.life\/.*?\.(?:png|gif|jpg|webp|jpeg|JPG|PNG|JPEG|GIF|WEBP)/g
  return {
    name: 'vite-plugin-lazy-image',
    enforce: 'pre',
    async transform(src, id) {
      if (!filter(id)) return
      const s = new MagicString(src)
      const matches = src.matchAll(regx)
      for (const match of matches) {
        const [url] = match
        const start = match.index!
        const end = start + url.length
        try {
          const info = await getImageInfo(url)
          const { width, height, format } = info
          s.overwrite(start, end, `${url}?_w=${width}&_h=${height}&format=${format}&cdn=qiniuyun`)
        } catch (err) {
          // pass
        }
      }
      return s.toString()
    },
  }
}
