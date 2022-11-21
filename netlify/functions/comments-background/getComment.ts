import middy from '@middy/core'
import { Response } from '../../core/app'
import auth from '../../core/middleware/auth'
import type { HandlerEvent } from '@netlify/functions'
import context from '../../core/middleware/context'
import { getComment } from '../../core/leancloud'
import { filterSensitiveFields } from './utils'

export default middy<HandlerEvent, any>()
  .use(auth({ week: true }))
  .handler(
    async (e, ctx) => {
      const isAuthed = context.isAuthed(ctx.awsRequestId)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:next-line
      const objectId = e.pathParameters.objectId as string
      const primitived = await getComment(objectId)

      if (!primitived) {
        return Response.notFound()
      }

      const comment = isAuthed ? primitived : filterSensitiveFields([primitived])[0]

      return Response.ok(comment)
    },
  )
