import Router from '@koa/router'
import { register, login } from '../controllers/auth_controller'
import { runValidation } from '../middleware/validation_middleware'
import { userLoginValidator } from '../validators/auth_validator'

export default new Router()
  // not using validation middleware for register because it seems that Mongoose's own validation works just as well
  .post('/register', register)
  .post('/login', runValidation(userLoginValidator), login)
