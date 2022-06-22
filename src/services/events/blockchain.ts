import { prisma } from '@services/prismaClient'
import { BlockchainService } from '@services/blockchain/service'
import Queue from 'bull'
import { redisURL } from './config'
import { Snapshot } from '@prisma/client'

export type BlockchainJob =
  | {
      type: 'addLog'
      organizationId: string
      logId: string
    }
  | {
      type: 'addSnapshot'
      snapshot: Snapshot
    }

export const getBlockchainQueue = () =>
  new Queue<BlockchainJob>('blockchainJob', redisURL, {
    defaultJobOptions: {
      attempts: 3
    }
  })

const blockchainQueue = getBlockchainQueue()

blockchainQueue.process(async (job, done) => {
  const service = new BlockchainService()

  if (job.data.type === 'addLog') {
    const { organizationId, logId } = job.data

    const blockchainResponse = await service.addLog(organizationId, logId)

    if (blockchainResponse.success) {
      console.log('blockchain response', blockchainResponse.data)
      done()
    } else {
      console.error('redis', blockchainResponse.data)
    }
  } else {
    const { snapshot } = job.data

    const blockchainResponse = await service.addSnapshot(
      snapshot.logId,
      snapshot
    )

    if (blockchainResponse.success) {
      console.log('redis: success')

      await prisma.blockchainTx.create({
        data: {
          snapshotId: snapshot.id,
          txHash: blockchainResponse.data.hash
        }
      })

      console.log('redis: created tx')

      done()
    } else {
      console.error('redis', blockchainResponse.data)
    }
  }
})
