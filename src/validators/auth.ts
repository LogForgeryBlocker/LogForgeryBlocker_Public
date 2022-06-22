import { Role } from '@typings/auth'
import Joi from 'joi'

export class AuthValidator {
  public static userToken() {
    return Joi.object({
      type: Joi.string().valid('USER_TOKEN').required(),
      userId: Joi.string().uuid().required(),
      username: Joi.string().required(),
      roles: Joi.array()
        .items(Joi.string().valid(...Object.values(Role)))
        .required(),
      organizationId: Joi.string().uuid().optional(),
      iat: Joi.number().required(),
      exp: Joi.number().required()
    })
  }

  public static login() {
    return Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required()
    })
  }

  public static register() {
    return Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required()
    })
  }
}
