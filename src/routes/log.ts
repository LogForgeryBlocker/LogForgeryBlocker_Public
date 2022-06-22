import {
  agentAuthMiddleware,
  existingOrganizationMiddleware,
  userAuthMiddleware
} from '@middlewares/auth'

import { LogController } from '@controllers/log'
import { LogValidator } from '@validators/log'
import { Router } from 'express'
import { schemaMiddleware } from '@middlewares/schema'
import { VerificationController } from '@controllers/verification'

const router = Router()

router.get(
  '/for_agent/',
  agentAuthMiddleware(),
  existingOrganizationMiddleware(),
  LogController.getAgentLogs
)

router.get(
  '/',
  userAuthMiddleware(['USER']),
  existingOrganizationMiddleware(),
  LogController.getAll
)

router.get(
  '/:id',
  userAuthMiddleware(['USER']),
  existingOrganizationMiddleware(),
  LogController.get
)

router.post(
  '/',
  agentAuthMiddleware(),
  existingOrganizationMiddleware(),
  schemaMiddleware(LogValidator.add()),
  LogController.add
)

router.post(
  '/:logId/verification',
  agentAuthMiddleware(),
  existingOrganizationMiddleware(),
  VerificationController.add
)

router.get(
  '/:logId/verification',
  agentAuthMiddleware(),
  existingOrganizationMiddleware(),
  VerificationController.get
)

export { router as logRouter }
