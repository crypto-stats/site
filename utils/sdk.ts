import { CryptoStatsSDK } from '@cryptostats/sdk'

export function getSDK(options?: any) {
  const sdk = new CryptoStatsSDK({
    moralisKey: process.env.NEXT_PUBLIC_MORALIS_KEY,
    executionTimeout: 100,
    ...options,
  })

  if (process.env.NEXT_PUBLIC_MORALIS_KEY) {
    const rpc = `https://speedy-nodes-nyc.moralis.io/${process.env.NEXT_PUBLIC_MORALIS_KEY}/arbitrum/mainnet`
    sdk.ethers.addProvider('arbitrum-one', rpc, { archive: true })
    sdk.ethers.addProvider(
      'avalanche',
      `https://speedy-nodes-nyc.moralis.io/${process.env.NEXT_PUBLIC_MORALIS_KEY}/avalanche/mainnet`,
      { archive: true }
    )
    sdk.ethers.addProvider(
      'fantom',
      `https://speedy-nodes-nyc.moralis.io/${process.env.NEXT_PUBLIC_MORALIS_KEY}/fantom/mainnet`,
      { archive: true }
    )
  }

  if (process.env.NEXT_PUBLIC_ALCHEMY_ETH_KEY) {
    const rpc = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ETH_KEY}`
    sdk.ethers.addProvider('ethereum', rpc, { archive: true })
  } else {
    console.error('Alchemy key not set')
  }

  if (process.env.NEXT_PUBLIC_OPTIMISM_RPC) {
    sdk.ethers.addProvider('optimism', process.env.NEXT_PUBLIC_OPTIMISM_RPC, { archive: true })
  }

  return sdk
}
