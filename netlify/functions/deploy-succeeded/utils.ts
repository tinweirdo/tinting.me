import qiniu from 'qiniu'
import fs from 'fs-extra'
import { QINIU_ACCESS_KEY, QINIU_SECRET_KEY } from "../../core/env"

const mac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY)
const cdnManager = new qiniu.cdn.CdnManager(mac)

export const refreshDirs = (dirs: string[]) => {
  return new Promise<void>((resolve, reject) => cdnManager.refreshDirs(dirs, (err) => err ? reject(err) : resolve()))
}

export const prefetchUrls = (urls: string[]) => {
 return new Promise<void>((resolve, reject) => cdnManager.prefetchUrls(urls, (err) => err ? reject(err) : resolve()))
}

export const refreshUrls = (urls: string[]) => {
  let p: Promise<any> = Promise.resolve()
  for (let i = 0;; i++) {
    const sliced = urls.slice(100 * i, 100 * (i + 1))
    p = p.then(() => {
      return new Promise<void>((resolve, reject) => cdnManager.refreshUrls(sliced, (err) => err ? reject(err) : resolve()))
    })
    if (!sliced.length) break
  }
  return p
}

export const getDistFiles = (path = 'dist'): string[] => {
  const results: string[] = []
  const files = fs.readdirSync(path)
  files.forEach((file) => {
    const newPath = path + '/' + file
    const stat = fs.statSync(newPath)
    if (stat.isDirectory()) {
      results.push(...getDistFiles(newPath))
    } else {
      results.push(newPath)
    }
  })
  return results.map((item) => item.replace(/^dist\//, ''))
}
