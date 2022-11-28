import { FilledComment } from 'netlify/core/types'
import { InjectionKey, provide, inject, readonly, ref, Ref, computed } from 'vue'
import { ReactiveVariable } from 'vue/macros'
import { getComments } from '~/api/comments'

const KEY = Symbol() as InjectionKey<{
  loading: Readonly<Ref<ReactiveVariable<boolean>>>
  comments: Readonly<Ref<ReactiveVariable<FilledComment[]>>>,
  parent: Readonly<Ref<ReactiveVariable<FilledComment> | undefined>>,
  disabled: Readonly<Ref<boolean>>
  setParent: (parent?: FilledComment) => void,
  onCommentCreateded: (comment: FilledComment) => void,
  onCommentUpdated: (objectId: string, newComment: Partial<FilledComment>) => void,
  onCommentDeleted: (objectId: string) => void,
  resetComments: () => Promise<FilledComment[]>
}>

export const provideComments = (id: Ref<string>, { disabled } : { disabled?: Ref<boolean> }) => {
  let comments = $ref<FilledComment[]>([])
  let parent = $ref<FilledComment | undefined>()
  let loading = $ref(false)
  const diabled = disabled ?? computed(() => false)
  const setParent = (p?: FilledComment) => {
    parent = p
  }
  const onCommentCreateded = (comment: FilledComment) => {
    if (comment.parent?.objectId) {
      comments.some((parent, i) => {
        if (parent.objectId === comment.parent?.objectId) {
          comments[i].children.push(comment)
          return true
        }
        return parent.children?.some((child, j) => {
          if (child.objectId === comment.parent?.objectId) {
            comments[i].children[j].children.push(comment)
            return true
          }
        })
      })
    } else {
      comments.unshift(comment)
    }
    setParent()
  }
  const onCommentUpdated = (objectId: string, newComment: Partial<FilledComment>) => {
    comments.some((comment, i) => {
      if (comment.objectId === objectId) {

        comments[i] = { ...comment, ...newComment }
        return true
      }
      return comment.children?.some((child, j) => {
        if (child.objectId === objectId) {
          comments[i].children[j] = { ...child, ...newComment }
          return true
        }
      })
    })
  }
  const onCommentDeleted = (objectId: string) => {
    setParent()
    comments.some((comment, i) => {
      if (comment.objectId === objectId) {
        comments.splice(i, 1)
        return true
      }
      return comment.children?.some((child, j) => {
        if (child.objectId === objectId) {
          comments[i].children.splice(j, 1)
          return true
        }
      })
    })
  }
  const resetComments = () => {
    loading = true
    getComments(id.value)
      .then(({ data }) => comments = data)
      .finally(() => loading = false)
  }
  provide(
    KEY,
    {
      loading: readonly($$(loading)),
      comments: readonly($$(comments)),
      disabled: readonly(diabled),
      parent: readonly($$(parent)),
      setParent,
      onCommentCreateded,
      onCommentUpdated,
      onCommentDeleted,
      resetComments,
    })
  return {
    loading: $$(loading),
    comments: $$(comments),
    parent: $$(parent),
    diabled,
    setParent,
    onCommentCreateded,
    resetComments,
  }
}

export default () => inject(KEY)
