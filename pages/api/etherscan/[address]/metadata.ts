import { CryptoStatsSDK } from '@cryptostats/sdk'
import { NextApiRequest, NextApiResponse } from 'next'
import { handleErrors } from 'utils/api-endpoints'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const address = req.query.address as string

  const sdk = new CryptoStatsSDK({
    infuraKey: process.env.INFURA_KEY!,
    etherscanKey: process.env.ETHERSCAN_KEY!,
  })

  const [bytecode, sourceCodeQuery, deployTxQuery] = await Promise.all([
    sdk.ethers.getProvider('ethereum').getCode(address),
    sdk.etherscan.query({ module: 'contract', action: 'getsourcecode', address }),
    sdk.etherscan.query({
      module: 'account',
      action: 'txlist',
      address,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 1,
      sort: 'asc',
    }),
  ])

  if (bytecode === '0x') {
    res.json({
      isContract: false,
    })
    return
  }

  let deployBlock = 0

  if (deployTxQuery[0].contractAddress?.length === 42) {
    deployBlock = parseInt(deployTxQuery[0].blockNumber)
  } else {
    const internalTx = await sdk.etherscan.query({
      module: 'account',
      action: 'txlistinternal',
      address,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 1,
      sort: 'asc',
    })

    if (internalTx[0].type === 'create') {
      deployBlock = parseInt(internalTx[0].blockNumber)
    }
  }

  let name = sourceCodeQuery[0].ContractName
  let abi = JSON.parse(sourceCodeQuery[0].ABI)
  let proxyImplementation: null | string = null

  if (sourceCodeQuery[0].Proxy === '1') {
    proxyImplementation = sourceCodeQuery[0].Implementation

    const implementationData = await sdk.etherscan.query({
      module: 'contract',
      action: 'getsourcecode',
      address: proxyImplementation,
    })

    name = implementationData[0].ContractName
    abi = JSON.parse(implementationData[0].ABI)
  }

  res.json({
    isContract: true,
    name,
    abi,
    deployBlock,
    proxyImplementation,
  })
}

export default handleErrors(handler)
