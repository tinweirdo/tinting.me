import fs from 'fs-extra'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import env from './env'

const DOMAIN = env.VITE_SITE_DOMAIN.replace(/\/?$/, '/')

const parser = new XMLParser()
const builder = new XMLBuilder({})

const parsed = parser.parse(fs.readFileSync('./dist/sitemap.xml'))

const urls = parsed.urlset.url.map((url) => {
  const patched = url.loc.replace(/\/?$/, '/')
  if (patched === DOMAIN + 'posts/' || patched === DOMAIN + 'categories/') {
    url.changeFreq = 'always'
  } else if (patched === DOMAIN + 'projects/') {
    url.changeFreq = 'monthly'
  } else {
    url.changeFreq = 'yearly'
  }
  return url
})

parsed.urlset.url = urls

fs.writeFileSync('./dist/sitemap.xml', builder.build(parsed))

