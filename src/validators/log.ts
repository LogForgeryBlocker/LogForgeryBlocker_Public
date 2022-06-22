import Joi from 'joi'

export class LogValidator {
  public static add() {
    return Joi.object({
      name: Joi.string().required()
    })
  }
}
