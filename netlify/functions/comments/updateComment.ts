import middy from "@middy/core"
import validator from "@middy/validator"
import { HandlerEvent } from "@netlify/functions"
import { getComment, updateComment } from "../../core/leancloud"
import auth from "../../core/middleware/auth"
import { Response } from '../../core/app'
import { Comment, CommentRole, CommentStatus } from "../../core/types"

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
        role: {
          type: 'string',
          enum: [CommentRole.Manager, CommentRole.Visitor],
        },
        status: {
          type: 'string',
          enum: [CommentStatus.Published, CommentStatus.Unreviewed],
        },
      },
    },
  },
}

export default middy<HandlerEvent, any>()
  .use(auth())
  .use(validator({ inputSchema }))
  .handler(
    async (e: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:next-line
      const objectId = e.pathParameters.objectId as string
      const comment = e.body as any as Comment
      await updateComment(objectId, comment)
      return Response.ok(await getComment(objectId))
    },
  )
