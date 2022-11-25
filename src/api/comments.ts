import { Comment, CommentStatus, FilledComment } from 'netlify/core/types'
import request, { ResponseBody } from './request'

export const createComment = (id: string, comment: Partial<Comment>) => request.post<any, ResponseBody<FilledComment>>('/comments', comment, { params: { id } })
export const getComments = (id: string) => request.get<any, ResponseBody<FilledComment[]>>('/comments', { params: { id } })
export const getComment = (objectId: string) => request.get<any, ResponseBody<FilledComment>>(`/comments/${objectId}`)
export const deleteComment = (objectId: string) => request.delete<any, ResponseBody>(`/comments/${objectId}`)
export const updateComment = (objectId: string, { nickname, email, website, content, parent, role, status }: Partial<Comment>) => {
  return request.put<any, ResponseBody>(`/comments/${objectId}`, { nickname, email, website, content, parent, role, status })
}
export const updateCommentStatus = (objectId: string, status: CommentStatus) => {
  return request.put<any, ResponseBody>(`/comments/${objectId}/status`, { status })
}
