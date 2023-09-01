import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import User from '../models/user_model'

export const isAuthenticated = async (ctx, next) => {
  ctx.assert(ctx.request?.headers.authorization, 400, 'Authorization header is missing')
  // split out "Bearer" from authorization header to get token part
  const token = String(ctx.request.headers.authorization).split(' ')[1]
  ctx.assert(token, 400, 'No token present in Authorization header')
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
  // the record _id from the user we created was stored in the token when we signed it
  const user = await User.findOne({ _id: decodedToken._id })
  ctx.assert(user, 401, 'Failed to authenticate user')
  // makes user available via ctx.state.user for the next middlware that might want to use it
  ctx.state.user = user
  await next()
}
