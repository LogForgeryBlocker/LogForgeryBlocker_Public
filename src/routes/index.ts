import { Router } from 'express'
import { agentRouter } from './agent'
import { authRouter } from './auth'
import { logRouter } from './log'
import { organizationRouter } from './organization'
import { snapshotRouter } from './snapshot'

const router = Router()

router.use('/log', logRouter)
router.use('/snapshot', snapshotRouter)
router.use('/organization', organizationRouter)
router.use('/agent', agentRouter)
router.use('/auth', authRouter)

export { router }
