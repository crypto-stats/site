import { create } from 'ipfs-http-client'

export function getInfuraNode() {
  if (!process.env.INFURA_IPFS_USER || !process.env.INFURA_IPFS_KEY) {
    throw new Error('Infura key missing')
  }

  const infuraAuthKey = Buffer.from(
    `${process.env.INFURA_IPFS_USER}:${process.env.INFURA_IPFS_KEY}`
  ).toString('base64')
  const infuraNode = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      Authorization: 'Basic ' + infuraAuthKey,
    },
  })
  return infuraNode
}

export async function saveToIPFS(file: string | Buffer): Promise<string> {
  let failedUpload: string | null = null
  const failHandler = (name: string) => () => {
    if (failedUpload) {
      throw new Error(`Uploads to ${failedUpload} and ${name} both failed`)
    }
    failedUpload = name
    return { IpfsHash: null, path: null }
  }

  const infuraNode = getInfuraNode()
  const infuraPromise = infuraNode.add(file)

  const graphNode = create('https://api.thegraph.com/ipfs/api/v0' as any)
  const graphPromise = graphNode.add(file)

  const csNode = create('https://ipfs.cryptostats.community' as any)
  const csPromise = csNode.add(file).catch(failHandler('CryptoStats'))

  const [infuraResult, graphResult, csResult] = await Promise.all([
    infuraPromise,
    graphPromise,
    csPromise,
  ])

  if (failedUpload) {
    console.warn(`2 out of 3 uploads successful, upload to ${failedUpload} failed`)
  }

  if (infuraResult.path && graphResult.path && infuraResult.path !== graphResult.path) {
    throw new Error(`Mismatched CIDs: ${infuraResult.path} & ${graphResult.path}`)
  }
  if (infuraResult.path && csResult.path && infuraResult.path !== csResult.path) {
    throw new Error(`Mismatched CIDs: ${infuraResult.path} & ${csResult.path}`)
  }

  return infuraResult.path || graphResult.path!
}
