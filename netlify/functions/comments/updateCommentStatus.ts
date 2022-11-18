import middy from "@middy/core"
import validator from "@middy/validator"
import { HandlerEvent } from "@netlify/functions"
import { updateComment } from "../../core/leancloud"
import auth from "../../core/middleware/auth"
import { Response } from '../../core/app'
import { CommentStatus } from "../../core/types"

const inputSchema = {
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      required: ['status'],
      additionalProperties: false,
      properties: {
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
    async (e, ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:next-line
      const objectId = e.pathParameters.objectId as string
      const status = (e.body  as any).status as CommentStatus
      updateComment(objectId, { status })
      return Response.ok()
    },
  )
