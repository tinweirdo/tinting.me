import middy from '@middy/core'
import { Response } from '../../core/app'
import auth from '../../core/middleware/auth'
import type { HandlerEvent } from '@netlify/functions'
import context from '../../core/middleware/context'
import { parseQuery } from '../../core/utils'
import { getComments } from '../../core/leancloud'
import { CommentStatus } from '../../core/types'
import { filterSensitiveFields, constructComments } from './utils'

export default middy<HandlerEvent, any>()
  .use(auth({ week: true }))
  .handler(
    async (e, ctx) => {
      return Response.ok(process.env)
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

      return Response.ok(constructComments(comments))
    },
  )
