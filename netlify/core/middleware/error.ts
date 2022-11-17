import type { MiddlewareObj } from '@middy/core'
import { Response } from '../app'
import logger from '../log'

export default (): MiddlewareObj<any, any> => ({
  onError: async (handler) => {
    logger.error(handler.error?.message ?? '', handler.error)
    handler.response = Response.error(handler.error ?? new Error('unkown error.'))
  },
})
