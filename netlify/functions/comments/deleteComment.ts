import middy from "@middy/core"
import { HandlerEvent } from "@netlify/functions"
import { deleteComment } from "../../core/leancloud"
import auth from "../../core/middleware/auth"
import { Response } from '../../core/app'

export default middy<HandlerEvent, any>()
  .use(auth())
  .handler(
    async (e) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:next-line
      const objectId = e.pathParameters.objectId as string
      await deleteComment(objectId)
      return Response.ok()
    },
  )
