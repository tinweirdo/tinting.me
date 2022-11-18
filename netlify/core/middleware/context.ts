import type { MiddlewareObj } from '@middy/core'

type Context = Record<string, any>

export const map = new Map<string, Record<string, any>>()
export const get = (id: string) => {
  if (!map.has(id)) {
    init(id)
  }
  return map.get(id) as Context
}
export const set = <T>(id: string, k: string, v: T) => {
  const ctx = get(id)
  ctx[k] = v
  return map.set(id, ctx)
}
export const init = (id: string) => map.set(id, {})
export const destroy = (id: string) => map.delete(id)
export const isAuthed = (id: string) => get(id).isAuthed
export default {
  map,
  get,
  set,
  init,
  destroy,
  isAuthed,
}

export const middleware = (): MiddlewareObj => ({
  before: async (req) => {
    init(req.context.awsRequestId)
  },
  after: async (req) => {
    destroy(req.context.awsRequestId)
  },
})
