import fs from 'fs-extra'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import env from './env'

const DOMAIN = env.VITE_SITE_DOMAIN.replace(/\/?$/, '/')

const parser = new XMLParser({ ignoreAttributes: false })
const builder = new XMLBuilder({ ignoreAttributes: false })

const parsed = parser.parse(fs.readFileSync('./dist/sitemap.xml'))

const urls = parsed.urlset.url.map((url) => {
  debugger
  const patched = url.loc.replace(/\/?$/, '/')
  if (patched === DOMAIN + 'posts/' || patched === DOMAIN + 'categories/') {
    url.changefreq = 'always'
  } else if (patched === DOMAIN + 'projects/') {
    url.changefreq = 'monthly'
  } else {
    url.changefreq = 'yearly'
  }
  return url
})

parsed.urlset.url = urls

fs.writeFileSync('./dist/sitemap.xml', builder.build(parsed))

