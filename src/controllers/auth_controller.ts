import User from '../models/user_model'
import jwt from 'jsonwebtoken'
import pick from 'lodash/pick'

export const register = async (ctx) => {
  const { firstName, lastName, email, password } = ctx.request.body
  try {
    ctx.body = await User.create({
      firstName,
      lastName,
      email,
      password
    })
    ctx.status = 201
  } catch (error) {
    ctx.body = { error }
    ctx.status = 400
  }
}

export const login = async (ctx) => {
  const { email, password } = ctx.request.body
  const user = await User.findOne({ email }).exec()
  ctx.assert(user, 401, 'User not found.')
  ctx.assert(await user.authenticate(password), 401, 'Incorrect password')
  ctx.body = {
    token: jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1 day'
    }),
    user: pick(user, ['_id', 'username', 'firstName', 'lastName', 'email'])
  }
}
