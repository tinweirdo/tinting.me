import middy from "@middy/core"
import validator from "@middy/validator"
import { HandlerEvent } from "@netlify/functions"
import { createComment, getComment } from "../../core/leancloud"
import auth from "../../core/middleware/auth"
import { parseQuery } from "../../core/utils"
import { Response } from '../../core/app'
import BF from '../../core/background-functions'
import context from '../../core/middleware/context'
import { Comment, CommentRole, CommentStatus } from "../../core/types"
import { AUTHOR_EMAIL } from "../../core/env"

import Mailer from './mailer'

const inputSchema = {
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      required: ['nickname', 'email', 'content'],
      additionalProperties: false,
      properties: {
        nickname: {
          type: 'string',
        },
        email: {
          type: 'string',
          pattern: '^.*?@.+?\\.\\w+$',
        },
        website: {
          type: 'string',
        },
        content: {
          type: 'string',
        },
        parent: {
          type: 'string',
        },
      },
    },
  },
}

export default middy<HandlerEvent, any>()
  .use(auth({ week: true }))
  .use(validator({ inputSchema }))
  .handler(
    async (e, ctx) => {
      const { id } = parseQuery(e.rawQuery)
      if (!id) {
        return Response.error(new Error('request params is invalid.'))
      }
      const isAuthed = context.isAuthed(ctx.awsRequestId)
      const comment = e.body as any as Comment
      comment.status = isAuthed ? CommentStatus.Published : CommentStatus.Unreviewed
      comment.role = comment.email === AUTHOR_EMAIL && isAuthed ? CommentRole.Manager : CommentRole.Visitor
      if (comment.parent) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:next-line
        comment.parent = { __type: 'Pointer', className: 'Comment', objectId: comment.parent }
      }
      const { objectId } = await createComment(id, comment)
      if (!isAuthed) await BF.get('mail', 'notice', { params: { objectId } })
      return Response.ok(await getComment(objectId))
    },
  )
