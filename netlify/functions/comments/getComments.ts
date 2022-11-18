import middy from '@middy/core'
import crypto from 'crypto'
import httpRouterHandler from '@middy/http-router'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import validator from '@middy/validator'
import type { Route } from '@middy/http-router'
import { Response } from '../../core/app'
import auth from '../../core/middleware/auth'
import error from '../../core/middleware/error'
import type { HandlerEvent } from '@netlify/functions'
import context from '../../core/middleware/context'
import { parseQuery } from '../../core/utils'
import { getComments } from '../../core/leancloud'
import { Comment, CommentStatus } from '../../core/types'

const SENSITIVE_FIELDS = ['updatedAt', 'role', 'status']

const filterSensitiveFields = (comments: Comment[]) => {
  for (let i = 0; i < comments.length; i++) {
    for (const field of SENSITIVE_FIELDS) {
      Reflect.deleteProperty(comments[i], field)
    }
  }
  return comments
}

// const constructComments = (comments: Comment[]) => {
//   const parents = []
//   // pmap stand for 'parent map', reflect objectId to index
//   const pmap = {}
//   for (const cmt of comments) {
//     if (!cmt.parent) {
//       pmap[cmt.]
//       parents.push(cmt)
//     }
//   }
// }

export default middy<HandlerEvent, any>()
  .use(auth({ week: true }))
  .handler(
    async (e, ctx) => {
      const isAuthed = context.isAuthed(ctx.awsRequestId)
      const { id } = parseQuery(e.rawQuery)
      if (!id) {
        throw new Error('param `id` is required.')
      }
      const where: Record<string, any> = { id }
      if (!isAuthed) {
        where.status = CommentStatus.Published
        where.createdAt = { $lte: { __type: 'Date', iso:  new Date().toISOString() } }
      }
      const primitived = await getComments(where)

      const comments = isAuthed ? primitived : filterSensitiveFields(primitived)

      const parents = comments.filter((cmt) => !cmt.parent)

      return Response.ok(comments)
    },
  )
