import { FilledComment } from 'netlify/core/types'
import { InjectionKey, provide, inject, readonly, ref, Ref, computed } from 'vue'
import { getComments } from '~/api/comments'

const KEY = Symbol() as InjectionKey<{
  comments: Readonly<Ref<FilledComment[]>>,
  parent: Readonly<Ref<FilledComment | undefined>>,
  disabled: Readonly<Ref<boolean>>
  setParent: (parent?: FilledComment) => void,
  onCommented: (comment: FilledComment) => void,
  resetComments: () => void
}>

export const provideComments = (id: Ref<string>, { disabled } : { disabled?: Ref<boolean> }) => {
  const comments = ref<FilledComment[]>([])
  const parent = ref<FilledComment | undefined>(undefined)
  const diabled = disabled ?? computed(() => false)
  const setParent = (p?: FilledComment) => {
    parent.value = p
  }
  const onCommented = (comment: FilledComment) => {
    if (comment.parent?.objectId) {
      comments.value.some((parent, i) => {
        if (parent.objectId === comment.parent?.objectId) {
          comments.value[i].children.push(comment)
          return true
        }
        return parent.children?.some((child, j) => {
          if (child.objectId === comment.parent?.objectId) {
            comments.value[i].children[j].children.push(comment)
            return true
          }
        })
      })
    } else {
      comments.value.unshift(comment)
    }
    setParent()
  }
  const resetComments = () => {
    getComments(id.value).then(({ data }) => comments.value = data)
  }
  provide(KEY, { comments: readonly(comments), disabled: readonly(diabled), parent: readonly(parent), setParent, onCommented, resetComments })
  return { comments, parent, setParent, onCommented, resetComments }
}

export default () => inject(KEY)
