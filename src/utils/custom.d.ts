import { AgentToken, UserToken } from '@typings/auth'

declare global {
  namespace Express {
    export interface Request {
      userToken?: string
      userTokenPayload?: UserToken

      agentToken?: string
      agentTokenPayload?: AgentToken
    }
  }
}
