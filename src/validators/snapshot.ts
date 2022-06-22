import Joi from 'joi'

export class SnapshotValidator {
  public static add() {
    return Joi.object({
      logId: Joi.string().uuid().required(),
      fingerprint: Joi.string().required(),
      firstLine: Joi.number().integer().min(0),
      lastLine: Joi.number().integer().min(Joi.ref('firstLine'))
    })
  }
}
