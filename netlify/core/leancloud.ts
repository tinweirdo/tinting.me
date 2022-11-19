import axios from 'axios'
import { LEANCLOUD_APP_ID, LEANCLOUD_APP_KEY, LEANCLOUD_REST_API } from './env'
import { Comment, CommentStatus, FilledComment } from './types'

const request = axios.create({
  headers: {
    'X-LC-Id': LEANCLOUD_APP_ID,
    'X-LC-Key': LEANCLOUD_APP_KEY,
    'Content-Type': 'application/json',
  },
})

request.interceptors
  .response.use(
    (res: any) => {
      if (/^2\d{2}$/.test(res.status)) {
        return Promise.resolve(res.data)
      }
      throw new Error(res.data?.error)
    },
  )

const COMMENT_API = LEANCLOUD_REST_API + '/1.1/classes/Comment'

export const getComments = (where: Record<string, any>) => {
  return request.get<any, { results: FilledComment[] }>(COMMENT_API, { params: { where: JSON.stringify(where), order: '-createdAt', include: 'parent' } })
    .then(
      (data) => {
        return data.results.map((item) => {
          if (item.parent) Reflect.deleteProperty(item.parent, '__type')
          return item
        })
      },
    )
}

export const getComment = (objectId: string) => {
  return request
    .get<any, FilledComment>(`${COMMENT_API}/${objectId}`, { params: { include: 'parent' } })
    .then((comment) => comment.objectId ? comment : undefined)
}

export const createComment = (id: string, comment: Comment) => {
  comment.id = id
  return request.post<any, Comment>(COMMENT_API, comment)
}

export const updateComment = (objectId: string, comment: Partial<Comment>) => {
  return request.put<any, Comment>(`${COMMENT_API}/${objectId}`, comment)
}

export const setCommentStatus = (objectId: string, status: CommentStatus) => {
  return updateComment(objectId, { status })
}

export const deleteComment = (objectId: string) => {
  return request.delete(`${COMMENT_API}/${objectId}`)
}
