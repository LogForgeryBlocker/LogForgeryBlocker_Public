import {
  agentAuthMiddleware,
  existingOrganizationMiddleware,
  userAuthMiddleware
} from '@middlewares/auth'

import { AgentConfigController, AgentController } from '@controllers/agent'
import { AgentConfigValidator, AgentValidator } from '@validators/agent'
import { Router } from 'express'
import { schemaMiddleware } from '@middlewares/schema'

const router = Router()

router.get(
  '/config/',
  agentAuthMiddleware(),
  existingOrganizationMiddleware(),
  AgentConfigController.get
)

router.put(
  '/config/:id',
  schemaMiddleware(AgentConfigValidator.update()),
  userAuthMiddleware(['ADMIN']),
  existingOrganizationMiddleware(),
  AgentConfigController.update
)

router.get(
  '/:id',
  userAuthMiddleware(['ADMIN']),
  existingOrganizationMiddleware(),
  AgentController.get
)

router.get(
  '/',
  userAuthMiddleware(['ADMIN']),
  existingOrganizationMiddleware(),
  AgentController.getAll
)

router.post(
  '/',
  schemaMiddleware(AgentValidator.add()),
  userAuthMiddleware(['ADMIN']),
  existingOrganizationMiddleware(),
  AgentController.add
)

router.put(
  '/:id',
  schemaMiddleware(AgentValidator.update()),
  userAuthMiddleware(['ADMIN']),
  existingOrganizationMiddleware(),
  AgentController.update
)

router.post(
  '/getToken/:id',
  userAuthMiddleware(['ADMIN']),
  existingOrganizationMiddleware(),
  AgentController.getTokenForAgent
)

export { router as agentRouter }
