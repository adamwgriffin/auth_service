import Router from '@koa/router'
import { isAuthenticated } from '../middleware/auth_middleware'
import { secret, protection } from '../controllers/protected_controller'

export default new Router()
  .use(isAuthenticated)
  .get('/secret', secret)
  .get('/protected', protection)
