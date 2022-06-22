import { NextFunction, Request, Response } from 'express'

import { ObjectSchema } from 'joi'
import { ResponseWrapper } from '../helpers/responseWrapper'

export const schemaMiddleware = (validator?: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validator) {
        await validator.validateAsync(req.body)
      }
      return next()
    } catch (error) {
      const response = new ResponseWrapper(res)

      return response.error(400, error.details[0].message)
    }
  }
}
