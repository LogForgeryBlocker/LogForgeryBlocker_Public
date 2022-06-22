import { Request, Response } from 'express'

import { ResponseWrapper } from './responseWrapper'

export const invalidRouteHandler = (_: Request, res: Response) => {
  const response = new ResponseWrapper(res)
  return response.error(404, 'Invalid api route')
}
