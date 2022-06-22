import { ethers } from 'ethers'
import { network } from './config'

export const getAppProvider = () =>
  ethers.getDefaultProvider(network, {
    alchemy: process.env.ALCHEMY_API_KEY
  })
