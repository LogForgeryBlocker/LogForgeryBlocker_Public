import { Request, Response } from 'express'

import { LogVerification, Organization } from '@prisma/client'
import { ResponseWrapper } from 'helpers/responseWrapper'
import { prisma } from '@services/prismaClient'

export class VerificationController {
  public static async get(req: Request, res: Response) {
    const { logId } = req.params
    const response = new ResponseWrapper(res)

    const organization: Organization = await prisma.organization.findFirst({
      where: { id: req.agentTokenPayload.organizationId }
    })

    if (organization == null) {
      return response.error(400, 'Organization with given id does not exist.')
    }

    const logVerification = await prisma.logVerification.findFirst({
      where: {
        logId
      }
    })

    if (logVerification == null) {
      return response.notFoundError()
    }

    return response.ok(logVerification)
  }

  public static async add(req: Request, res: Response) {
    const { isCorrect } = req.body
    const { logId } = req.params
    const response = new ResponseWrapper(res)

    const organization: Organization = await prisma.organization.findFirst({
      where: { id: req.agentTokenPayload.organizationId }
    })

    if (organization == null) {
      return response.error(400, 'Organization with given id does not exist.')
    }

    const logVerification: LogVerification =
      await prisma.logVerification.create({
        data: {
          logId,
          isCorrect
        }
      })

    if (logVerification == null) {
      return response.error(500, 'Could not create log object')
    }

    return response.ok(logVerification)
  }
}
