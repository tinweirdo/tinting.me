import type { MiddlewareObj } from '@middy/core'
import type { HandlerEvent } from '@netlify/functions'
import context from '../context'
import { verify } from '../jwt'

interface Config {
  week?: boolean | ((event: any) => boolean | Promise<boolean>)
}

export default ({ week }: Config = {}): MiddlewareObj<HandlerEvent, any> => ({
  before: async (req) => {
    const event = req.event
    let _week
    if (typeof week === 'function') {
      const weekFn = week(event)
      _week = weekFn instanceof Promise ? await weekFn : weekFn
    } else {
      _week = week
    }

    try {
      await verify(event.headers?.authorization?.split(' ').pop() ?? '')
      context.set(req.context.awsRequestId, 'isAuthed', true)
    } catch (err) {
      if (!_week) throw err
    }
  },
})
