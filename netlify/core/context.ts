type Ctx = Record<string, any>

export const map = new Map<string, Record<string, any>>()
export const get = (id: string) => {
  if (!map.has(id)) {
    init(id)
  }
  return map.get(id) as Ctx
}
export const set = <T>(id: string, k: string, v: T) => {
  const ctx = get(id)
  ctx[k] = v
  return map.set(id, ctx)
}
export const init = (id: string) => map.set(id, {})
export const destroy = (id: string) => map.delete(id)

export default {
  map,
  get,
  set,
  init,
  destroy,
}
