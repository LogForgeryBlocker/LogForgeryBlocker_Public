import { AgentToken, UserToken } from '@typings/auth'
import { JsonWebTokenError, verify } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { TokenError, extractBearerToken } from '@utils/auth'

import { AgentValidator } from '@validators/agent'
import { AuthValidator } from '@validators/auth'
import { OrganizationRole } from '@prisma/client'
import { ResponseWrapper } from '@helpers/responseWrapper'
import { intersection } from 'lodash'

// Middleware that verifies whether user is authenticated and optionally, whether has one of the roles provided in the array
export const userAuthMiddleware = (roles?: OrganizationRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const response = new ResponseWrapper(res)

    try {
      const token = extractBearerToken(req)

      const decoded = verify(token, process.env.JWT_SECRET_KEY) as UserToken

      const tokenValidator = AuthValidator.userToken()
      const { error: validationError } = tokenValidator.validate(decoded)

      if (validationError) {
        throw new JsonWebTokenError(
          'Invalid token payload: ' + validationError.message
        )
      }

      if (roles) {
        // Verify if user has correct role.
        const hasCorrectRole = intersection(roles, decoded.roles).length > 0

        if (!hasCorrectRole) {
          throw new TokenError('Invalid role')
        }
      }

      req.userToken = token
      req.userTokenPayload = decoded

      next()
    } catch (e) {
      if (e instanceof JsonWebTokenError || e instanceof TokenError) {
        return response.authenticationError(e.message)
      }

      return response.internalServerError()
    }
  }
}

export const agentAuthMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const response = new ResponseWrapper(res)

    try {
      const token = extractBearerToken(req)

      const decoded = verify(token, process.env.JWT_SECRET_KEY) as AgentToken

      const tokenValidator = AgentValidator.agentToken()
      const { error: validationError } = tokenValidator.validate(decoded)

      if (validationError) {
        throw new JsonWebTokenError(
          'Invalid token payload: ' + validationError.message
        )
      }

      req.agentToken = token
      req.agentTokenPayload = decoded

      next()
    } catch (e) {
      if (e instanceof JsonWebTokenError || e instanceof TokenError) {
        return response.authenticationError(e.message)
      }

      return response.internalServerError()
    }
  }
}

export const existingOrganizationMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const response = new ResponseWrapper(res)

    if (!req.userTokenPayload?.organizationId && !req.agentTokenPayload) {
      return response.notFoundError()
    }

    next()
  }
}
