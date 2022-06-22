import { prisma } from '@services/prismaClient'

import Queue from 'bull'
import { redisURL } from './config'

const agentDeadlinesQueue = new Queue('verifyAgentLoggingQueue', redisURL)

agentDeadlinesQueue.process(async (_, done) => {
  const now = new Date().toISOString()
  const agentDeadlines = await prisma.agentLogDeadline.findMany({
    where: { deadline: { lt: now } }
  })

  for (const agentDeadline of agentDeadlines) {
    console.error(
      `Agent with id: ${agentDeadline.agentId}, failed to log before deadline.`
    )

    // Report errors when events system is completed
  }

  done()
})

export type UpdateAgentDeadlineJob = {
  agentId: string
}

agentDeadlinesQueue.add(null, { repeat: { every: 120 } })

const getUpdateAgentDeadlineQueue = () =>
  new Queue<UpdateAgentDeadlineJob>('updateAgentDeadlineQueue', redisURL)

const updateAgentDeadlineQueue = getUpdateAgentDeadlineQueue()

const timeOffset = 2 * 60 * 1000

updateAgentDeadlineQueue.process(async (job, done) => {
  const { agentId } = job.data

  const config = await prisma.agentConfig.findFirst({
    where: {
      agentId
    }
  })

  const deadline = new Date(
    Date.now() + config.snapshotInterval * 1000 + timeOffset
  )

  prisma.agentLogDeadline.upsert({
    where: {
      agentId
    },
    create: {
      agentId,
      deadline
    },
    update: {
      deadline
    }
  })

  done()
})
