import { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'
import { handleErrors } from 'utils/api-endpoints'
import { getProxyForCollection } from 'utils/lists-chain'

function typeCheck(value: any, type: string, label: string) {
  if (typeof value !== type) {
    throw new Error(`Invalid ${label}`)
  }
}

const registryAbi = [
  'event CollectionCreated(bytes32 indexed collection, address proxy)',
  'function createCollection(bytes32 collection) external returns (address proxy)',
]

const proxyAbi = [
  'function update(bytes32 oldElement, bytes32 newElement) external',
  'function batchUpdate(bytes32[] calldata oldElements, bytes32[] calldata newElements) external',
]

const ZERO = '0x0000000000000000000000000000000000000000000000000000000000000000'

const cidToBytes32 = (cid: string) => ethers.utils.hexlify(ethers.utils.base58.decode(cid).slice(2))

const rpc = `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`
const registryAddress = '0xF22e79604434ea8213eb7D79fcEB854e5E4283f7'


const collectionAdmins = process.env.NEXT_PUBLIC_COLLECTION_ADMINS
  ? JSON.parse(process.env.NEXT_PUBLIC_COLLECTION_ADMINS.toLowerCase())
  : {}

function isSignerValid(signer: string, collectionId: string) {
  if (collectionAdmins[collectionId] && collectionAdmins[collectionId].indexOf(signer.toLowerCase()) !== -1) {
    return true
  }

  return signer.toLowerCase() !== process.env.NEXT_PUBLIC_ADMIN_ACCOUNT?.toLowerCase()
}

function verifyOperation(
  method: string,
  collectionId: string,
  cid: string,
  signature: string,
  previousVersion?: string
) {
  let oldElement = ZERO
  let newElement = ZERO
  let message = ''

  switch (method) {
    case 'add':
      newElement = cidToBytes32(cid)
      message = `Add ${cid} to ${collectionId}`
      break
    case 'update':
      if (!previousVersion) {
        throw new Error('Must provide previous version')
      }
      newElement = cidToBytes32(cid)
      oldElement = cidToBytes32(previousVersion)
      message = `Replace ${previousVersion} with ${cid} on ${collectionId}`
      break
    case 'remove':
      oldElement = cidToBytes32(cid)
      message = `Remove ${cid} from ${collectionId}`
      break
    default:
      throw new Error(`Unknown method ${method}`)
  }

  const signer = ethers.utils.verifyMessage(message, signature)
  if (!isSignerValid(signer, collectionId)) {
    throw new Error('Signer does not match admin')
  }

  return { oldElement, newElement }
}

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

  const transactions = []

  let proxyAddress = await getProxyForCollection(listId)
  if (!proxyAddress) {
    const registry = new ethers.Contract(registryAddress, registryAbi, signer)
    const newListTx = await registry.createCollection(listIdBytes32)
    const newListReceipt = await newListTx.wait()
    proxyAddress = newListReceipt.events[0].args.proxy as string

    transactions.push(newListTx.hash)
  }

  const { oldElement, newElement } = verifyOperation(
    method,
    listId,
    cid,
    signature,
    previousVersion
  )

  const proxyContract = new ethers.Contract(proxyAddress, proxyAbi, signer)
  const tx = await proxyContract.update(oldElement, newElement)
  await tx.wait()

  transactions.push(tx.hash)

  res.json({ success: true, transactions })
}

export default handleErrors(handler)
