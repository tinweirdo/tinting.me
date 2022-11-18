import axios from 'axios'
import { LEANCLOUD_APP_ID, LEANCLOUD_MASTER_KEY, LEANCLOUD_REST_API } from './env'
import { Comment, CommentStatus } from './types'

const request = axios.create({
  headers: {
    'X-LC-Id': LEANCLOUD_APP_ID,
    'X-LC-Key': LEANCLOUD_MASTER_KEY + ',master',
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
    (err) => {
      throw new Error(err.message, { cause: err })
    },
  )

const COMMENT_API = LEANCLOUD_REST_API + '/1.1/classes/Comment'

export const getComments = (where: Record<string, any>) => {
  return request.get<any, { results: Comment[] }>(COMMENT_API, { params: { where: JSON.stringify(where), order: '-createdAt', include: 'parent' } })
    .then((data) => data.results)
}

export const getComment = (objectId: string) => {
  return request.get<any, Comment>(`${COMMENT_API}/${objectId}`, { params: { include: 'parent' } })
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
