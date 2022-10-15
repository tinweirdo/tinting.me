export interface FrontMatter {
  title: string,
  subtitle?: string,
  date?: Date,
  category?: string,
  tags: string[],
  head?: { [k: keyof any]: any },
  [k: keyof any]: any
}
