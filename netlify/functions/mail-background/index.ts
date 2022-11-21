import middy from '@middy/core'
import httpRouterHandler from '@middy/http-router'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import type { Route } from '@middy/http-router'
import error from '../../core/middleware/error'
import notice from './notice'

const routes: Route<any>[] = [
  // {
  //   method: 'GET',
  //   path: '/api/mail-background/reply/{objectId}',
  //   handler: reply,
  // },
  {
    method: 'GET',
    path: '/api/mail-background/notice',
    handler: notice,
  },
]

export const handler = middy()
  .use(httpJsonBodyParser())
  .use(error())
  .handler(httpRouterHandler(routes))
