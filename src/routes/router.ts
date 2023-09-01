import Router from '@koa/router'
import diagnosticsRouter from './diagnosticsRouter'

export default new Router()
  .use(diagnosticsRouter.routes())
