import { Agent, User } from '@prisma/client'
import { AgentToken, UserToken } from '@typings/auth'

import { Request } from 'express'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'

export const generateUserToken = (user: User) => {
  const token: Omit<UserToken, 'iat' | 'exp'> = {
    type: 'USER_TOKEN',
    userId: user.id,
    username: user.username,
    roles: user.roles,
    ...(user.organizationId && { organizationId: user.organizationId })
  }

  return sign(token, process.env.JWT_SECRET_KEY, {
    expiresIn: '12h'
  })
}

export const generateAgentToken = (agent: Agent) => {
  const token: Omit<AgentToken, 'iat'> = {
    type: 'AGENT_TOKEN',
    agentId: agent.id,
    name: agent.name,
    organizationId: agent.organizationId
  }

  return sign(token, process.env.JWT_SECRET_KEY)
}

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10)
}

export class TokenError extends Error {}

export const extractBearerToken = (req: Request) => {
  const authorization = req.headers.authorization

  if (!authorization) {
    throw new TokenError('Missing authorization header')
  }

  try {
    const token = authorization.split('Bearer ')[1]
    return token
  } catch {
    throw new TokenError('Invalid authorization header format')
  }
}

export const isValidPassword = (password: string) => {
  return password.length >= 6 && password.length <= 20
}
