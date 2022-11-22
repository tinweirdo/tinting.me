import middy from '@middy/core'
import httpRouterHandler from '@middy/http-router'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import type { Route } from '@middy/http-router'
import error from '../../core/middleware/error'
import { middleware as useContext } from '../../core/middleware/context'
import notice from './notice'
import reply from './reply'

const routes: Route<any>[] = [
  {
    method: 'PUT',
    path: '/api/mail/notice',
    handler: notice,
  },
  {
    method: 'PUT',
    path: '/api/mail/reply',
    handler: reply,
  },
]

export const handler = middy()
  .use(useContext())
  .use(httpJsonBodyParser())
  .use(error())
  .handler(httpRouterHandler(routes))
