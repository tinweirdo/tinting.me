import type { MiddlewareObj } from '@middy/core'
import context from '../context'

export default (): MiddlewareObj => ({
  before: async (req) => {
    context.init(req.context.awsRequestId)
  },
  after: async (req) => {
    context.destroy(req.context.awsRequestId)
  },
})
