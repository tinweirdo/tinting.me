import { FilledComment } from "../../core/types"

const SENSITIVE_FIELDS = ['updatedAt', 'status']

export const filterSensitiveFields = (comments: FilledComment[]) => {
  for (let i = 0; i < comments.length; i++) {
    for (const field of SENSITIVE_FIELDS) {
      Reflect.deleteProperty(comments[i], field)
    }
  }
  return comments
}

export const constructComments = (comments: FilledComment[]) => {
  const parents: FilledComment[] = []
  const children: FilledComment[] = []
  // pmap stand for 'parent map', reflect objectId to index
  const pmap = {}
  for (const cmt of comments) {
    if (!cmt.parent) {
      cmt.children = []
      pmap[cmt.objectId]  = parents.length
      parents.push(cmt)
    } else {
      children.push(cmt)
    }
  }
  for (const cmt of children) {
    const parent = cmt.parent?.objectId
    if (parent && Reflect.has(pmap, parent)) {
      parents[Reflect.get(pmap, parent)].children.unshift(cmt)
    }
  }

  return parents
}
