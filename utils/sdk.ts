import { CryptoStatsSDK } from '@cryptostats/sdk'
import { IPFS_GATEWAY } from 'resources/constants'

export function getSDK(options?: any) {
  const sdk = new CryptoStatsSDK({
    moralisKey: process.env.NEXT_PUBLIC_MORALIS_KEY,
    ipfsGateway: IPFS_GATEWAY,
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
  sdk.ethers.addProvider('bsc', 'https://bscrpc.com')
  sdk.ethers.addProvider('moonbeam', 'https://rpc.api.moonbeam.network')
  sdk.ethers.addProvider('acala', 'https://eth-rpc-acala.aca-api.network')
  sdk.ethers.addProvider('polygon', 'https://matic-mainnet-archive-rpc.bwarelabs.com', { archive: true })
  sdk.ethers.addProvider('gnosis-chain', 'https://rpc.gnosischain.com')
  sdk.ethers.addProvider('avalanche', 'https://api.avax.network/ext/bc/C/rpc');
  sdk.ethers.addProvider('fantom', 'https://rpc.ankr.com/fantom/');

  sdk.cosmos.addChain('cosmoshub', 'https://cosmos-mainnet-rpc.allthatnode.com:26657/')
  sdk.cosmos.addChain('osmosis', 'https://osmosis-mainnet-rpc.allthatnode.com:26657')

  return sdk
}
