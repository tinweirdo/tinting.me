import { computed, ComputedRef } from "vue"
import { useRouter } from "vue-router"
import { FrontMatter } from "~/types"
export interface Post {
  path: string,
  frontmatter: FrontMatter,
  title: string,
  date: Date,
  category?: string,
  thumb?: string,
  excerpt?: string
}
export default (category?: string) => {
  const router = useRouter()
  const posts: ComputedRef<Post[]> = computed(() => {
    return router.getRoutes()
      .filter((route) => {
        if (category && route.meta.frontmatter.category !== category) {
          return false
        }
        return route.path.startsWith('/posts/') && !route.path.endsWith('.html') && route.meta.frontmatter?.date
      })
      .sort((a, b) => +new Date(b.meta.frontmatter.date) - +new Date(a.meta.frontmatter.date) )
      .map(({ meta, path }) => ({
        path,
        frontmatter: meta.frontmatter,
        title: meta.frontmatter.title,
        date: meta.frontmatter.date,
        category: meta.frontmatter.category,
        thumb: meta.frontmatter.thumb,
        excerpt: meta.excerpt,
      }))
  })
  return posts
}
