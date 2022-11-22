import middy from "@middy/core"
import { HandlerEvent } from "@netlify/functions"
import { parseQuery } from "../../core/utils"
import { Response } from '../../core/app'

import Mailer from './mailer'

export default middy<HandlerEvent, any>()
  .handler(
    async (e) => {
      const { objectId } = parseQuery(e.rawQuery)
      if (!objectId) {
        return Response.error(new Error('request params is invalid.'))
      }
      await Mailer.reply(objectId)
      return Response.ok()
    },
  )
