import Joi from 'joi'

export const userLoginValidator = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()
})
