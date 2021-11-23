import { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'
import { handleErrors } from 'utils/api-endpoints'

function typeCheck(value: any, type: string, label: string) {
  if (typeof value !== type) {
    throw new Error(`Invalid ${label}`)
  }
}

const registryAbi = [
  'event ListCreated(bytes32 indexed list, address proxy)',
  'function createList(bytes32 list) external returns (address proxy)',
]

const proxyAbi = [
  'function update(bytes32 oldElement, bytes32 newElement) external',
  'function batchUpdate(bytes32[] calldata oldElements, bytes32[] calldata newElements) external',
]

const ZERO = '0x0000000000000000000000000000000000000000000000000000000000000000'

const cidToBytes32 = (cid: string) =>
  ethers.utils.hexlify(ethers.utils.base58.decode(cid).slice(2))

const rpc = `https://speedy-nodes-nyc.moralis.io/${process.env.NEXT_PUBLIC_MORALIS_KEY}/eth/kovan`
const registryAddress = '0xa21cc34c6662e6f38dc81d958552c2aa1864ab47'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    throw new Error('Only POST requests allowed')
  }

  const { listId, cid, signature, method, previousVersion } = req.body

  typeCheck(listId, 'string', 'listId')
  typeCheck(cid, 'string', 'cid')
  typeCheck(signature, 'string', 'signature')
  typeCheck(method, 'string', 'signature')
  if (previousVersion) {
    typeCheck(previousVersion, 'string', 'previousVersion')
  }

  const listIdBytes32 = ethers.utils.formatBytes32String(listId)

  if (!process.env.MNEMONIC) {
    throw new Error('No mnemonic set')
  }

  const provider = new ethers.providers.JsonRpcProvider(rpc)
  const signer = ethers.Wallet.fromMnemonic(process.env.MNEMONIC).connect(provider)

  const graphRequest = await fetch('https://api.thegraph.com/subgraphs/name/dmihal/stateless-list-registry-kovan', {
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        list(id: "${listId}") {
          proxy
        }
      }`,
    }),
    method: 'POST',
  })
  const json = await graphRequest.json()

  const transactions = []

  let proxyAddress = json.data.list?.proxy
  if (!proxyAddress) {
    const registry = new ethers.Contract(registryAddress, registryAbi, signer)
    const newListTx = await registry.createList(listIdBytes32)
    const newListReceipt = await newListTx.wait()
    proxyAddress = newListReceipt.events[0].args.proxy

    transactions.push(newListTx.hash)
  }

  const oldElement = previousVersion ? cidToBytes32(previousVersion) : ZERO
  const newElement = cidToBytes32(cid)

  const proxyContract = new ethers.Contract(proxyAddress, proxyAbi, signer)
  const tx = await proxyContract.update(oldElement, newElement)
  await tx.wait()

  transactions.push(tx.hash)

  res.json({ success: true, transactions })
}

export default handleErrors(handler)
