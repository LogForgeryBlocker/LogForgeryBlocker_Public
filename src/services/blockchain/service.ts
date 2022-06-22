import { Provider, TransactionResponse } from '@ethersproject/abstract-provider'
import { Signer } from 'ethers'
import { contractAddress } from './config'
import { getAppProvider } from './provider'
import { getAppSigner } from './signer'
import { Response } from '@typings/response'
import { Logger, Logger__factory } from '@typings/loggerContract'
import { Snapshot } from '@prisma/client'

export class BlockchainService {
  private signer: Signer
  private contract: Logger

  constructor(provider: Provider = getAppProvider()) {
    this.signer = getAppSigner(provider)
    this.contract = new Logger__factory(this.signer).attach(contractAddress)

    this.contract
      .deployed()
      .then((deployed) => console.log('Contract deployed:', !!deployed))
  }

  public async addLog(
    organizationId: string,
    logId: string
  ): Promise<Response<TransactionResponse>> {
    try {
      const response = await this.contract.addLog(organizationId, logId)

      return {
        success: true,
        data: response
      }
    } catch (e) {
      console.error(e)
      return {
        success: false,
        data: e.message
      }
    }
  }

  public async addSnapshot(
    logId: string,
    snapshot: Snapshot
  ): Promise<Response<TransactionResponse>> {
    try {
      const response = await this.contract.addSnapshot(logId, {
        hashValue: snapshot.fingerprint,
        timestamp: new Date(snapshot.createdAt).getSeconds(),
        recordsCount: snapshot.lastLine + 1
      })

      return {
        success: true,
        data: response
      }
    } catch (e) {
      console.error(e)

      return {
        success: false,
        data: e.message
      }
    }
  }
}
