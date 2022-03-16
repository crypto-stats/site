export interface Parameter {
  name: string
  type?: string
  description?: string
}

export interface Query {
  id: string
  name: string
  description?: string
  parameters?: Parameter[]
}

export interface CollectionMetadata {
  name: string
  description?: string
  forumCategory?: string
  icon?: string
  iconColor?: string
  queries?: Query[]
}

export const DEFAULT_FORUM_CATEGORY = 'protocols/other-collections'

const collectionMetadata: { [id: string]: CollectionMetadata } = {
  'apy-current': {
    name: 'Current APY',
    description: 'The current yield rates of various lending protocols and yield aggregators.',
    forumCategory: 'protocols/apys',
    icon: '🗓',
    iconColor: 'palette-1',
    queries: [
      {
        id: 'apyCurrent',
        name: 'Current APY',
        description: 'The current APY yielded',
        parameters: [
          {
            name: 'Asset Address',
            type: 'address',
            description: 'The address of the underlying asset',
          },
        ],
      },
    ],
  },
  'apy-range': {
    name: 'Average APY',
    description:
      'The average yield rate of various lending protocols and yield aggregators across a period of time.',
    forumCategory: 'protocols/apys',
    icon: '📆',
    iconColor: 'palette-2',
    queries: [
      {
        id: 'apyOverDateRange',
        name: 'APY over date range',
        description: 'The average APY yielded between two days',
        parameters: [
          {
            name: 'Asset Address',
            type: 'address',
            description: 'The address of the underlying asset',
          },
          {
            name: 'Start Date',
            type: 'date',
            description: 'The beginning date to query (inclusive)',
          },
          {
            name: 'End Date',
            type: 'date',
            description: 'The end date to query (exclusive)',
          },
        ],
      },
    ],
  },
  'dex-volumes': {
    name: 'DEX Volumes',
    description: 'The current yield rates of various lending protocols and yield aggregators.',
    forumCategory: 'protocols/apys',
    icon: '🔁',
    iconColor: 'palette-1',
    queries: [
      {
        id: 'oneDayTotalVolumeUSD',
        name: 'One Day Volume (USD)',
        description: 'Total trading volume on a single day',
        parameters: [
          {
            name: 'Date',
            type: 'date',
            description: 'The date to query volume for (UTC time)',
          },
        ],
      },
    ],
  },
  'eth-beacon-chain': {
    name: 'Ethereum Beacon Chain',
    description:
      'Various beacon chain statistics, such as the current staking APY, the total ETH staked, total ETH paid as rewards, and more',
    icon: '🏎',
    iconColor: 'palette-3',
    queries: [
      {
        id: 'currentAPY',
        name: 'Current APY',
        description: 'The current ETH-denominated APY yielded by the becon chain',
      },
      {
        id: 'tvlUSDCurrent',
        name: 'Total value locked (USD)',
        description: 'The USD value of ETH locked in the beacon chain (staked ETH & rewards)',
      },
      {
        id: 'tvlETHCurrent',
        name: 'Total value locked (ETH)',
        description: 'The total ETH locked in the beacon chain (staked ETH & rewards)',
      },
      {
        id: 'totalRewards',
        name: 'Total ETH rewars',
        description: 'The total ETH rewarded to validators by the beacon chain',
      },
      {
        id: 'totalStakedETH',
        name: 'Total ETH staked',
        description: 'The total ETH actively staked on the beacon chain',
      },
    ],
  },
  'eth-burned': {
    name: 'ETH Burned',
    description: 'The amount of ETH burned by EIP-1559',
    icon: '🔥',
    iconColor: 'palette-2',
    queries: [
      {
        id: 'tokensBurnedTotal',
        name: 'Total ETH burned',
        description: 'The total amount of ETH burned by EIP-1559',
      },
      {
        id: 'tokensBurnedTotalUSD',
        name: 'Total ETH burned (USD)',
        description: 'The value of all ETH burned (priced at the time of burn)',
      },
      {
        id: 'tokensBurnedOnDay',
        name: 'ETH burned on date',
        description: 'The amount of ETH burned on a UTC calendar date',
        parameters: [
          {
            name: 'Date',
            type: 'date',
            description: 'The date to query (UTC time)',
          },
        ],
      },
      {
        id: 'tokensBurnedOnDayUSD',
        name: 'ETH burned on date (USD)',
        description: 'The value of ETH burned on a UTC calendar date',
        parameters: [
          {
            name: 'Date',
            type: 'date',
            description: 'The date to query (UTC time)',
          },
        ],
      },
      {
        id: 'tokensBurnedOnDateRange',
        name: 'ETH burned in date range',
        description: 'The amount of ETH burned over a date range',
        parameters: [
          {
            name: 'Start Date',
            type: 'date',
            description: 'The start of the date range (inclusive)',
          },
          {
            name: 'End Date',
            type: 'date',
            description: 'The end of the date range (exclusive)',
          },
        ],
      },
      {
        id: 'tokensBurnedOnDateRangeUSD',
        name: 'ETH burned in date range (USD)',
        description: 'The value of all ETH burned over a date range',
        parameters: [
          {
            name: 'Start Date',
            type: 'date',
            description: 'The start of the date range (inclusive)',
          },
          {
            name: 'End Date',
            type: 'date',
            description: 'The end of the date range (exclusive)',
          },
        ],
      },
      {
        id: 'tokensBurnedInRecentSeconds',
        name: 'ETH burned in recent seconds',
        description: 'The number of ETH burned in a recent time period',
        parameters: [
          {
            name: 'Seconds',
            type: 'number',
            description: 'The number of seconds to query, counting back from the current time',
          },
        ],
      },
      {
        id: 'tokensBurnedInRecentSecondsUSD',
        name: 'ETH burned in recent seconds (USD)',
        description: 'The value of ETH burned in recent seconds',
        parameters: [
          {
            name: 'Seconds',
            type: 'number',
            description: 'The number of seconds to query, counting back from the current time',
          },
        ],
      },
      {
        id: 'tokensBurnedInRecentTimePeriods',
        name: 'ETH burned over recent time periods',
        description: 'Array of ETH burned over recent time spans',
        parameters: [
          {
            name: 'Time period',
            type: 'enum',
            description: '"minute", "hour" or "day"',
          },
          {
            name: 'Number of periods',
            type: 'number',
            description: 'The number of time periods to query',
          },
        ],
      },
      {
        id: 'currentIndexedBlock',
        name: 'Total ETH burned (USD)',
        description: 'The value of all ETH burned (at the time of burn)',
      },
    ],
  },
  'eth-staking-pools': {
    name: 'ETH Staking Pools',
    description: 'The current APY and total ETH staked of various staking providers',
    icon: '💎',
    iconColor: 'palette-1',
    queries: [
      {
        id: 'totalStakedETH',
        name: 'Total Staked ETH',
        description: 'The total amount of ETH staked by this validator',
      },
      {
        id: 'apy',
        name: 'APY',
        description: 'The APY provided to users by the staking provider',
      },
    ],
  },
  fees: {
    name: 'Fee Revenue',
    description: 'Total fees paid to a protocol on a given day.',
    forumCategory: 'protocols/fees',
    icon: '💰',
    iconColor: 'palette-8',
    queries: [
      {
        id: 'oneDayTotalFees',
        name: 'One day total fees',
        description: 'Query the USD value of all fees paid to a protocol on a given calendar date.',
        parameters: [
          {
            name: 'Date',
            type: 'date',
            description: 'The date to query fees for (UTC time)',
          },
        ],
      },
    ],
  },
  'fee-range': {
    name: 'Fee Revenue over Date Range',
    description: 'Total fees paid to a protocol across a date range.',
    forumCategory: 'protocols/fees',
    icon: '💰',
    iconColor: 'palette-5',
    queries: [
      {
        id: 'dateRangeTotalFees',
        name: 'Total fees over date range',
        description: 'Query the USD value of all fees paid to a protocol across a range of dates.',
        parameters: [
          {
            name: 'Start date',
            type: 'date',
            description: 'The beginning of the date range (inclusive, UTC time)',
          },
          {
            name: 'End date',
            type: 'date',
            description: 'The end date of the date range (exclusive, UTC time)',
          },
        ],
      },
    ],
  },
  issuance: {
    name: 'Issuance',
    description: 'The amount of tokens issued in the past day, in USD.',
    forumCategory: 'protocols/issuance',
    icon: '🖨',
    iconColor: 'palette-1',
    queries: [
      {
        id: 'issuance7DayAvgUSD',
        name: '7 day average issuance (USD)',
        description:
          'Query the USD value of assets issued per day (averaged over the previous 7 days).',
      },
      {
        id: 'issuanceRateCurrent',
        name: 'Current issuance rate',
        description:
          'The annualized issuance rate percentage (in decimal form, averaged over the previous 7 days).',
      },
    ],
  },
  'l2-fees': {
    name: 'Layer-2 Fees',
    description: 'The USD transaction fees for basic transactions on Ethereum layer-2s.',
    forumCategory: 'protocols/tx-fees',
    icon: '🌀',
    iconColor: 'palette-6',
    queries: [
      {
        id: 'feeTransferEth',
        name: 'Fee to transfer Ether',
        description: 'The current USD transaction fee to transfer ETH.',
      },
      {
        id: 'feeTransferERC20',
        name: 'Fee to transfer ERC20 tokens',
        description: 'The current USD transaction fee to transfer arbitrary tokens.',
      },
      {
        id: 'feeSwap',
        name: 'Fee to swap ERC20 tokens',
        description: 'The current USD transaction fee to swap two tokens on a basic DEX.',
      },
    ],
  },
  treasuries: {
    name: 'DAO Treasuries',
    description: 'The total value and assets currently held in DAO treasuries.',
    forumCategory: 'protocols/treasuries',
    icon: '🏛',
    iconColor: 'palette-1',
    queries: [
      {
        id: 'currentTreasuryUSD',
        name: 'Current treasury balance in USD',
        description: 'The value of assets held by the treasury, less any debt.',
      },
      {
        id: 'currentLiquidTreasuryUSD',
        name: 'Current liquid treasury balance in USD',
        description:
          'The value of transferable assets held by the tresury (typically excluding vesting assets).',
      },
      {
        id: 'currentTreasuryPortfolio',
        name: 'Current treasury portfolio',
        description: 'All assets held in a portfolio.',
      },
      {
        id: 'recentProposals',
        name: 'Recent governance proposals',
      },
    ],
  },
}

export default collectionMetadata
