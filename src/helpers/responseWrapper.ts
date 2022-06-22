import { Response } from 'express'

export class ResponseWrapper {
  res: Response

  constructor(res: Response) {
    this.res = res
  }

  ok(data: object) {
    return this.res.status(200).json({
      success: true,
      data
    })
  }

  error(statusCode: number, message: string) {
    return this.res.status(statusCode).json({
      success: false,
      data: { message }
    })
  }

  notFoundError() {
    return this.error(404, 'Not found')
  }

  badRequestError(message: string) {
    return this.error(400, message)
  }

  authenticationError(message: string) {
    return this.error(401, message)
  }

  internalServerError() {
    return this.error(500, 'Internal server error')
  }
}
