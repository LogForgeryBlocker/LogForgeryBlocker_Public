import { Request, Response } from 'express'

import { Organization } from '@prisma/client'
import { ResponseWrapper } from 'helpers/responseWrapper'
import { prisma } from '@services/prismaClient'
import { getBlockchainQueue } from '@services/events/blockchain'

export class LogController {
  public static async get(req: Request, res: Response) {
    const { id } = req.params
    const response = new ResponseWrapper(res)

    const log = await prisma.log.findFirst({
      where: {
        id,
        organizationId: req.userTokenPayload.organizationId
      },
      include: {
        agent: true,
        logVerification: true
      }
    })

    if (log == null) {
      return response.notFoundError()
    }

    return response.ok(log)
  }

  public static async getAll(req: Request, res: Response) {
    const response = new ResponseWrapper(res)
    const logs = await prisma.log.findMany({
      where: {
        organizationId: req.userTokenPayload.organizationId
      },
      include: {
        agent: true,
        logVerification: true
      }
    })

    return response.ok(logs)
  }

  public static async add(req: Request, res: Response) {
    const { name } = req.body
    const response = new ResponseWrapper(res)
    const blockchainQueue = getBlockchainQueue()

    const organization: Organization = await prisma.organization.findFirst({
      where: { id: req.agentTokenPayload.organizationId }
    })

    if (organization == null) {
      return response.error(400, 'Organization with given id does not exist.')
    }

    const log = await prisma.log.create({
      data: {
        name,
        organizationId: req.agentTokenPayload.organizationId,
        agentId: req.agentTokenPayload.agentId,
        records: 0
      }
    })

    if (log == null) {
      return response.error(500, 'Could not create log object')
    }

    blockchainQueue.add({
      type: 'addLog',
      organizationId: organization.id,
      logId: log.id
    })

    return response.ok(log)
  }

  public static async getAgentLogs(req: Request, res: Response) {
    const response = new ResponseWrapper(res)

    const logs = await prisma.log.findMany({
      where: {
        agentId: req.agentTokenPayload.agentId
      }
    })

    if (logs == null) {
      return response.internalServerError()
    }

    return response.ok(logs)
  }
}
