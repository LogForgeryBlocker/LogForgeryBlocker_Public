import { Request, Response } from 'express'

import { ResponseWrapper } from '@helpers/responseWrapper'
import _ from 'lodash'
import { generateAgentToken } from '@utils/auth'
import { prisma } from '@services/prismaClient'

export class AgentController {
  public static async get(req: Request, res: Response) {
    const response = new ResponseWrapper(res)
    const { id } = req.params

    const agent = await prisma.agent.findFirst({
      where: {
        id,
        organizationId: req.userTokenPayload.organizationId
      },
      include: {
        config: true
      }
    })

    return response.ok(agent)
  }

  public static async getAll(req: Request, res: Response) {
    const response = new ResponseWrapper(res)

    const agents = await prisma.agent.findMany({
      where: {
        organizationId: req.userTokenPayload.organizationId
      },
      include: {
        config: true
      }
    })

    return response.ok(agents)
  }

  public static async add(req: Request, res: Response) {
    const response = new ResponseWrapper(res)

    const { name } = req.body

    const agent = await prisma.agent.create({
      data: {
        name,
        organizationId: req.userTokenPayload.organizationId,
        active: true
      }
    })

    if (!agent) {
      return response.internalServerError()
    }

    const config = await prisma.agentConfig.create({
      data: {
        maxRecordCount: 100,
        snapshotInterval: 60,
        agentId: agent.id
      }
    })

    if (!config) {
      return response.internalServerError()
    }

    const resp = {
      ...agent,
      config: config
    }

    return response.ok(resp)
  }

  public static async update(req: Request, res: Response) {
    const response = new ResponseWrapper(res)
    const { id } = req.params

    const fieldsToUpdate = _.omitBy(req.body, _.isNil)

    const agent = await prisma.agent.findFirst({
      where: {
        id,
        organizationId: req.userTokenPayload.organizationId
      }
    })
    if (!agent) {
      return response.notFoundError()
    }

    const updatedAgent = await prisma.agent.update({
      data: {
        ...fieldsToUpdate
      },
      where: {
        id
      }
    })
    if (!updatedAgent) {
      return response.internalServerError()
    }

    return response.ok(updatedAgent)
  }

  public static async getTokenForAgent(req: Request, res: Response) {
    const response = new ResponseWrapper(res)
    const { id } = req.params

    const agent = await prisma.agent.findFirst({
      where: {
        id,
        organizationId: req.userTokenPayload.organizationId
      }
    })

    if (!agent) {
      return response.notFoundError()
    }

    const token = generateAgentToken(agent)

    return response.ok({ token })
  }
}

export class AgentConfigController {
  public static async get(req: Request, res: Response) {
    const response = new ResponseWrapper(res)

    const agent = await prisma.agent.findFirst({
      where: {
        id: req.agentTokenPayload.agentId
      },
      include: {
        config: true
      }
    })
    if (!agent?.config) {
      return response.notFoundError()
    }
    return response.ok(agent.config)
  }

  public static async update(req: Request, res: Response) {
    const response = new ResponseWrapper(res)
    const { id } = req.params

    const fieldsToUpdate = _.omitBy(req.body, _.isNil)

    const config = await prisma.agentConfig.findFirst({
      where: {
        id
      },
      include: {
        agent: true
      }
    })

    if (
      !config?.agent ||
      config.agent.organizationId != req.userTokenPayload.organizationId
    ) {
      return response.notFoundError()
    }

    const updatedConfig = await prisma.agentConfig.update({
      data: {
        ...fieldsToUpdate
      },
      where: {
        id
      }
    })

    if (!updatedConfig) {
      return response.internalServerError()
    }

    return response.ok(updatedConfig)
  }
}
