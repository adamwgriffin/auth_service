import Router from '@koa/router'
import diagnosticsRouter from './diagnostics_router'
import authRouter from './auth_router'
import protectedRouter from './protected_router'

export default new Router()
  .use(diagnosticsRouter.routes())
  .use(authRouter.routes())
  .use(protectedRouter.routes())
