import {
  agentAuthMiddleware,
  existingOrganizationMiddleware,
  userAuthMiddleware
} from '@middlewares/auth'

import { Router } from 'express'
import { SnapshotController } from '@controllers/snapshot'
import { SnapshotValidator } from '@validators/snapshot'
import { schemaMiddleware } from '@middlewares/schema'

const router = Router()

router.get(
  '/:id',
  userAuthMiddleware(['USER']),
  existingOrganizationMiddleware(),
  SnapshotController.get
)

router.get(
  '/for_log/:logId',
  userAuthMiddleware(['USER']),
  existingOrganizationMiddleware(),
  SnapshotController.getAllForLog
)

router.get(
  '/agent_for_log/:logId',
  agentAuthMiddleware(),
  existingOrganizationMiddleware(),
  SnapshotController.getAllForLog
)

router.post(
  '/',
  agentAuthMiddleware(),
  existingOrganizationMiddleware(),
  schemaMiddleware(SnapshotValidator.add()),
  SnapshotController.add
)

export { router as snapshotRouter }
