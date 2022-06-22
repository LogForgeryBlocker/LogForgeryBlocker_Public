import { Request, Response } from 'express'

import { ResponseWrapper } from 'helpers/responseWrapper'
import { prisma } from '@services/prismaClient'
import { v4 as uuid } from 'uuid'

export class OrganizationController {
  public static async get(req: Request, res: Response) {
    const response = new ResponseWrapper(res)

    const user = await prisma.user.findFirst({
      where: {
        id: req.userTokenPayload.userId
      },
      include: {
        organization: true
      }
    })

    if (!user) {
      return response.error(400, 'User does not exist')
    }

    if (!user.organization) {
      return response.notFoundError()
    }

    return response.ok(user.organization)
  }

  public static async add(req: Request, res: Response) {
    const response = new ResponseWrapper(res)
    const { name } = req.body

    const user = await prisma.user.findFirst({
      where: {
        id: req.userTokenPayload.userId
      },
      include: {
        organization: true
      }
    })

    if (!user) {
      return response.error(400, 'User does not exist')
    }

    if (user.organization) {
      return response.error(400, 'User already has an organization')
    }

    const id = uuid()

    const [organization] = await prisma.$transaction([
      prisma.organization.create({ data: { name, id } }),
      prisma.user.update({
        data: {
          organizationId: id,
          roles: ['USER', 'ADMIN']
        },
        where: {
          id: req.userTokenPayload.userId
        },
        include: {
          organization: true
        }
      })
    ])

    return response.ok({ organization })
  }
}
