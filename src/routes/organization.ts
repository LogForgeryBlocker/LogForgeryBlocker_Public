import { OrganizationController } from '@controllers/organization'
import { OrganizationValidator } from '@validators/organization'
import { Router } from 'express'
import { schemaMiddleware } from '@middlewares/schema'
import { userAuthMiddleware } from '@middlewares/auth'

const router = Router()

router.get('/', userAuthMiddleware(['USER']), OrganizationController.get)

router.post(
  '/',
  userAuthMiddleware(),
  schemaMiddleware(OrganizationValidator.add()),
  OrganizationController.add
)

export { router as organizationRouter }
