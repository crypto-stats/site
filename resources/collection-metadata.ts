export interface CollectionMetadata {
  name: string
  description?: string
}

const collectionMetadata: { [id: string]: CollectionMetadata } = {
  'apy-current': {
    name: 'Current APY',
    description: 'The current yield rates of various lending protocols and yield aggregators.',
  },
  'apy-range': {
    name: 'Average APY',
    description: 'The average yield rate of various lending protocols and yield aggregators across a period of time.',
  },
  'eth-beacon-chain': {
    name: 'Ethereum Beacon Chain',
    description: 'Various beacon chain statistics, such as the current staking APY, the total ETH staked, total ETH paid as rewards, and more',
  },
  'eth-burned': {
    name: 'ETH Burned',
    description: 'The amount of ETH burned by EIP-1559',
  },
  'eth-staking-pools': {
    name: 'ETH Staking Pools',
    description: 'The current APY and total ETH staked of various staking providers',
  },
  fees: {
    name: 'Fee Revenue',
    description: 'Total fees paid to a protocol on a given day.',
  },
  'fee-range': {
    name: 'Fee Revenue over Date Range',
    description: 'Total fees paid to a protocol across a date range.',
  },
  issuance: {
    name: 'Issuance',
    description: 'The amount of tokens issued in the past day, in USD.',
  },
  treasuries: {
    name: 'DAO Treasuries',
    description: 'The total value and assets currently held in DAO treasuries.',
  },
}

export default collectionMetadata
