import { FilledComment } from 'netlify/core/types'
import { InjectionKey, provide, inject, readonly, ref, Ref } from 'vue'
import { getComments } from '~/api/comments'

const KEY = Symbol() as InjectionKey<{
  comments: Readonly<Ref<FilledComment[]>>,
  parent: Readonly<Ref<FilledComment | undefined>>,
  setParent: (parent?: FilledComment) => void,
  onCommented: (comment: FilledComment) => void
}>

export const provideComments = (id: Ref<string>) => {
  const comments = ref<FilledComment[]>([])
  const parent = ref<FilledComment | undefined>(undefined)
  const setParent = (p?: FilledComment) => {
    parent.value = p
  }
  const onCommented = (comment: FilledComment) => {
    if (comment.parent?.objectId) {
      comments.value
        .find((c) => c.objectId === comment.parent?.objectId)
        ?.children
        ?.push(comment)
        return
    }
    comments.value.unshift(comment)
    setParent()
  }
  getComments(id.value).then(({ data }) => comments.value = data)
  provide(KEY, { comments: readonly(comments), parent: readonly(parent), setParent, onCommented })
  return { comments, parent, setParent, onCommented }
}

export default () => inject(KEY)
