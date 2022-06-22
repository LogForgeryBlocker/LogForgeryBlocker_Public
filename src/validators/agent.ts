import Joi from 'joi'

export class AgentValidator {
  public static agentToken() {
    return Joi.object({
      type: Joi.string().valid('AGENT_TOKEN').required(),
      agentId: Joi.string().uuid().required(),
      name: Joi.string().required(),
      organizationId: Joi.string().uuid().required(),
      iat: Joi.number().required()
    })
  }

  public static add() {
    return Joi.object({
      name: Joi.string().required()
    })
  }

  public static update() {
    return Joi.object({
      name: Joi.string().optional(),
      active: Joi.bool().optional()
    })
  }
}

export class AgentConfigValidator {
  public static update() {
    return Joi.object({
      maxRecordCount: Joi.number().optional(),
      snapshotInterval: Joi.number().optional()
    })
  }
}
