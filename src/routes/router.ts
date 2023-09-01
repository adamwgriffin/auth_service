import Router from '@koa/router'
import diagnosticsRouter from './diagnostics_router'
import authRouter from './auth_router'

export default new Router()
  .use(diagnosticsRouter.routes())
  .use(authRouter.routes())
