import usePosts from "./usePosts"

export default () => {
  const catesMap = usePosts().value.reduce((cates, { category }) => {
    if (!category) {
      return cates
    }
    if (!cates?.[category]) {
      cates[category] = 0
    }
    cates[category]++
    return cates
  }, {} as { [k: string]: number })
  return Object.entries(catesMap).map(([name, count]) => ({ name, count }))
}
