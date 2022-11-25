import 'vue-router'

export interface FrontMatter {
  title: string,
  subtitle?: string,
  date: Date,
  category?: string,
  thumb?: string,
  head?: { [k: keyof any]: any },
  comment?: 'enabled' | 'disabled'
  [k: keyof any]: any
}


declare module 'vue-router' {
  interface RouteMeta {
    frontmatter: FrontMatter,
    excerpt: string
  }
}