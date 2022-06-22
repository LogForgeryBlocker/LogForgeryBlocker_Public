import Joi from 'joi'

export class OrganizationValidator {
  public static add() {
    return Joi.object({
      name: Joi.string().required()
    })
  }
}
