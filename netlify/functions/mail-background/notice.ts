import middy from '@middy/core'
import auth from '../../core/middleware/auth'
import type { HandlerEvent } from '@netlify/functions'
import mailer from './mailer'
import { parseQuery } from '../../core/utils'
import { JWT_SECRET } from '../../core/env'

export default middy<HandlerEvent, any>()
  .use(auth())
  .handler(
    async (e, ctx) => {
      const { jwt_secret, objectId } = parseQuery(e.rawQuery)
      if (jwt_secret !== JWT_SECRET) {
        return
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:next-line
      (async () => await mailer.reply(objectId))()
    },
  )
