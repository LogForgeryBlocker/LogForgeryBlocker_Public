export const Role: {
  USER: 'USER'
  ADMIN: 'ADMIN'
} = {
  USER: 'USER',
  ADMIN: 'ADMIN'
}

export type Role = typeof Role[keyof typeof Role]

export type UserToken = {
  type: 'USER_TOKEN'
  userId: string
  username: string
  roles: Role[]
  organizationId?: string
  iat: number
  exp: number
}

export type AgentToken = {
  type: 'AGENT_TOKEN'
  agentId: string
  name: string
  organizationId: string
  iat: number
}
