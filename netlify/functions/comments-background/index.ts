import middy from '@middy/core'
import httpRouterHandler from '@middy/http-router'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import type { Route } from '@middy/http-router'
import error from '../../core/middleware/error'
import { middleware as useContext } from '../../core/middleware/context'
import createComment from './createComment'
import getComment from './getComment'
import getComments from './getComments'
import updateComment from './updateComment'
import updateCommentStatus from './updateCommentStatus'
import deleteComment from './deleteComment'

const routes: Route<any>[] = [
  {
    method: 'GET',
    path: '/api/comments',
    handler: getComments,
  },
  {
    method: 'GET',
    path: '/api/comments/{objectId}',
    handler: getComment,
  },
  {
    method: 'POST',
    path: '/api/comments',
    handler: createComment,
  },
  {
    method: 'PUT',
    path: '/api/comments/{objectId}/status',
    handler: updateCommentStatus,
  },
  {
    method: 'PUT',
    path: '/api/comments/{objectId}',
    handler: updateComment,
  },
  {
    method: 'DELETE',
    path: '/api/comments/{objectId}',
    handler: deleteComment,
  },
]

export const handler = middy()
  .use(useContext())
  .use(httpJsonBodyParser())
  .use(error())
  .handler(httpRouterHandler(routes))
