import middy from '@middy/core'
import crypto from 'crypto'
import httpRouterHandler from '@middy/http-router'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import validator from '@middy/validator'
import type { Route } from '@middy/http-router'
import { Response } from '../../core/app'
import auth from '../../core/middleware/auth'
import error from '../../core/middleware/error'
import type { HandlerEvent } from '@netlify/functions'
import context, { middleware as useContext } from '../../core/middleware/context'
import { AUTH_PASSWORD, AUTH_USERNAME } from '../../core/env'
import { encode } from '../../core/jwt'

const postSchema = {
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      required: ['username', 'password'],
      additionalProperties: false,
      properties: {
        username: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  },
}

const post = middy<HandlerEvent, any>()
  .use(auth({ week: true }))
  .use(validator({ inputSchema: postSchema }))
  .handler(
    async (e: any, ctx) => {
      if (context.get(ctx.awsRequestId).isAuthed) {
        return Response.ok('already logined.')
      }

      const { username, password } = e.body as any

      if (username !== AUTH_USERNAME) {
        return Response.forbidden('username is invalid.')
      }

      const hash = crypto.createHash('sha256').update(AUTH_PASSWORD).digest('hex')
      if (hash !== password) {
        return Response.forbidden('password is invalid.')
      }

      return Response.ok({
        type: 'Bearer',
        token: await encode(),
      })
    },
  )


const routes: Route<any>[] = [
  {
    method: 'POST',
    path: '/api/login',
    handler: post,
  },
]

export const handler = middy()
  .use(useContext())
  .use(httpJsonBodyParser())
  .use(error())
  .handler(httpRouterHandler(routes))
