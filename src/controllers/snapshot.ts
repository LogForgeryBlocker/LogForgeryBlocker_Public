import { Request, Response } from 'express'

import { ResponseWrapper } from 'helpers/responseWrapper'
import { isString } from 'lodash'
import { prisma } from '@services/prismaClient'
import { getBlockchainQueue } from '@services/events/blockchain'

export class SnapshotController {
  public static async get(req: Request, res: Response) {
    const { id } = req.params
    const response = new ResponseWrapper(res)

    const snapshot = await prisma.snapshot.findFirst({
      where: {
        id
      },
      include: {
        log: true,
        transaction: true
      }
    })

    if (snapshot == null) {
      return response.notFoundError()
    }

    if (snapshot.log.organizationId !== req.userTokenPayload.organizationId) {
      // Returning 404 instead of 403, to not reveal any information
      return response.notFoundError()
    }

    return response.ok(snapshot)
  }

  public static async getAllForLog(req: Request, res: Response) {
    const { logId } = req.params
    const response = new ResponseWrapper(res)

    if (!logId || !isString(logId)) {
      return response.notFoundError()
    }

    const log = await prisma.log.findFirst({
      where: {
        id: logId
      },
      include: {
        snapshots: { include: { transaction: true } }
      }
    })

    if (log == null) {
      return response.notFoundError()
    }

    const organizationId =
      req.userTokenPayload?.organizationId ??
      req.agentTokenPayload?.organizationId

    if (log.organizationId !== organizationId) {
      return response.notFoundError()
    }

    return response.ok(log.snapshots)
  }

  public static async add(req: Request, res: Response) {
    const response = new ResponseWrapper(res)
    const blockchainQueue = getBlockchainQueue()

    const { firstLine, lastLine, logId, fingerprint } = req.body

    const log = await prisma.log.findFirst({
      where: {
        id: logId,
        organizationId: req.agentTokenPayload.organizationId
      }
    })

    if (log == null) {
      return response.notFoundError()
    }

    if (log.agentId !== req.agentTokenPayload.agentId) {
      return response.error(
        400,
        'This agent cannot update snapshots to this log'
      )
    }

    if (firstLine !== log.records) {
      return response.error(
        400,
        'First line index mismatched with database contents.'
      )
    }

    const [snapshot] = await prisma.$transaction([
      prisma.snapshot.create({
        data: {
          firstLine,
          lastLine,
          fingerprint,
          logId
        }
      }),
      prisma.log.update({
        where: {
          id: logId
        },
        data: {
          records: lastLine + 1
        }
      })
    ])

    if (snapshot == null) {
      response.error(500, 'Could not create new snapshot')
    }

    blockchainQueue.add({
      type: 'addSnapshot',
      snapshot
    })

    return response.ok(snapshot)
  }
}
