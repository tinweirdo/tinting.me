import fs from 'fs-extra'
import matter from 'gray-matter'

const path = './pages/posts/'

export default () => {
  return fs.readdirSync(path)
    .filter((item) => item.endsWith('.md'))
    .filter((post) => {
      const { data } = matter(fs.readFileSync(path + post).toString())
      return data.hidden
    })
    .map((post) => "**/posts/" + post)
}
