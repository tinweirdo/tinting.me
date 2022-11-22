import middy from "@middy/core"
import context from '../../core/middleware/context'
import { HandlerEvent } from "@netlify/functions"
import auth from "../../core/middleware/auth"
import { parseQuery } from "../../core/utils"
import { Response } from '../../core/app'

import Mailer from './mailer'

export default middy<HandlerEvent, any>()
  .use(auth({ week: true }))
  .handler(
    async (e, ctx) => {
      const { objectId } = parseQuery(e.rawQuery)
      const isAuthed = context.isAuthed(ctx.awsRequestId)
      if (isAuthed) {
        return Response.ok()
      }
      if (!objectId) {
        return Response.error(new Error('request params is invalid.'))
      }
      await Mailer.notice(objectId)
      return Response.ok()
    },
  )
