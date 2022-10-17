import { dirname } from 'path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import type { FeedOptions, Item } from 'feed'
import { Feed } from 'feed'
import env from './env'

const { VITE_SITE_NAME, VITE_AUTHOR, VITE_EMAIL, VITE_DOMAIN, VITE_DESCRIPTION } = env

const AUTHOR = {
  name: VITE_AUTHOR,
  email: VITE_EMAIL,
  link: VITE_DOMAIN,
}
const markdown = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
})

async function run() {
  await buildBlogRSS()
}

async function buildBlogRSS() {
  const files = await fg('./pages/posts/*.md')

  const options = {
    title: VITE_SITE_NAME,
    description: VITE_DESCRIPTION,
    id: VITE_DOMAIN,
    link: VITE_DOMAIN,
    copyright: `CC BY-NC-SA 4.0 2013-PRESENT © ${VITE_AUTHOR}`,
    feedLinks: {
      json: `${VITE_DOMAIN}feed.json`,
      atom: `${VITE_DOMAIN}feed.atom`,
      rss: `${VITE_DOMAIN}feed.xml`,
    },
  }
  const posts: any[] = (
    await Promise.all(
      files.filter((i) => !i.includes('index'))
        .map(async (i) => {
          const raw = await fs.readFile(i, 'utf-8')
          const { data, content } = matter(raw)

          const html = markdown.render(content)
            .replace('src="/', `src="${VITE_DOMAIN}/`)

          if (data.image?.startsWith('/'))
            data.image = VITE_DOMAIN + data.image

          return {
            ...data,
            date: new Date(data.date),
            content: html,
            author: [AUTHOR],
            link: VITE_DOMAIN + i.replace(/^pages(.+)\.md$/, '$1'),
          }
        }),
    ))
    .filter(Boolean)

  posts.filter((post) => !post.hidden).sort((a, b) => +new Date(b.date) - +new Date(a.date))

  await writeFeed('feed', options, posts)
}

async function writeFeed(name: string, options: FeedOptions, items: Item[]) {
  options.author = AUTHOR
  options.image = `${VITE_DOMAIN}avatar.png`
  options.favicon = `${VITE_DOMAIN}logo.png`

  const feed = new Feed(options)

  items.forEach((item) => feed.addItem(item))
  await fs.ensureDir(dirname(`./dist/${name}`))
  await fs.writeFile(`./dist/${name}.xml`, feed.rss2(), 'utf-8')
  await fs.writeFile(`./dist/${name}.atom`, feed.atom1(), 'utf-8')
  await fs.writeFile(`./dist/${name}.json`, feed.json1(), 'utf-8')
}

run()
