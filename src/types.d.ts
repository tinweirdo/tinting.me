export interface FrontMatter {
  title: string,
  subtitle?: string,
  date?: Date,
  category?: string,
  tags: string[],
  [k: string]: any
}
