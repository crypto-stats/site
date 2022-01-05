import { CryptoStatsSDK } from '@cryptostats/sdk'

export function getSDK(options?: any) {
  const sdk = new CryptoStatsSDK({
    moralisKey: process.env.NEXT_PUBLIC_MORALIS_KEY,
    ...options,
  })

  if (process.env.NEXT_PUBLIC_OPTIMISM_RPC) {
    sdk.ethers.addProvider('optimism', process.env.NEXT_PUBLIC_OPTIMISM_RPC, { archive: true })
  }

  return sdk
}
