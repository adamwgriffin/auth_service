import Router from '@koa/router'
import diagnosticsRouter from './diagnostics_router'

export default new Router()
  .use(diagnosticsRouter.routes())
