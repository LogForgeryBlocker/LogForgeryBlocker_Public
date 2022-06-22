import { Router } from 'express'
import { schemaMiddleware } from '@middlewares/schema'
import { AuthController } from '@controllers/auth'
import { AuthValidator } from '@validators/auth'

const router = Router()

router.post(
  '/login',
  schemaMiddleware(AuthValidator.login()),
  AuthController.login
)

router.post(
  '/register',
  schemaMiddleware(AuthValidator.register()),
  AuthController.register
)

export { router as authRouter }
