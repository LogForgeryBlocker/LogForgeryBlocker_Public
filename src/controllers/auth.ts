import { ResponseWrapper } from '@helpers/responseWrapper'
import { prisma } from '@services/prismaClient'
import { Request, Response } from 'express'
import { generateUserToken, hashPassword, isValidPassword } from '@utils/auth'
import { omit } from 'lodash'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

export class AuthController {
  public static async login(req: Request, res: Response) {
    const { username, password } = req.body
    const response = new ResponseWrapper(res)

    const user = await prisma.user.findFirst({
      where: {
        username
      }
    })

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return response.error(400, 'Invalid username or password')
    }

    response.ok({
      user: omit(user, 'password'),
      token: generateUserToken(user)
    })
  }

  public static async register(req: Request, res: Response) {
    const { username, password } = req.body
    const response = new ResponseWrapper(res)

    if (!isValidPassword(password)) {
      return response.error(400, 'Invalid password')
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        username
      }
    })

    if (existingUser) {
      return response.error(400, 'This username is already taken')
    }

    const userId = uuid()
    const organizationId = uuid()

    const [, newUser] = await prisma.$transaction([
      prisma.organization.create({
        data: {
          id: organizationId,
          name: '8Bisons'
        }
      }),
      prisma.user.create({
        data: {
          id: userId,
          username,
          password: hashPassword(password),
          roles: ['USER', 'ADMIN'],
          organizationId
        }
      })
    ])

    if (!newUser) {
      return response.error(500, 'Could not create user')
    }

    response.ok({
      user: omit(newUser, 'password'),
      token: generateUserToken(newUser)
    })
  }
}
