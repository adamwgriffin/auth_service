import Router from '@koa/router'
import { ping, check } from '../controllers/diagnostics_controller'

export default new Router()
  .get('/ping', ping)
  .get('/check', check)
