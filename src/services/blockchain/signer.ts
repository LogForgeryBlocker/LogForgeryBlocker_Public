import { Signer, Wallet } from 'ethers'
import { Provider } from '@ethersproject/abstract-provider'

export const getAppSigner = (provider: Provider): Signer =>
  new Wallet(process.env.PRIVATE_KEY, provider)
