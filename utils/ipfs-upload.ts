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
  const infuraNode = getInfuraNode()
  const infuraPromise = infuraNode.add(file)

  const graphNode = create('https://api.thegraph.com/ipfs/api/v0' as any)
  const graphPromise = graphNode.add(file)

  const [infuraResult, graphResult] = await Promise.all([
    infuraPromise,
    graphPromise,
  ])

  if (infuraResult.path && graphResult.path && infuraResult.path !== graphResult.path) {
    throw new Error(`Mismatched CIDs: ${infuraResult.path} & ${graphResult.path}`)
  }

  return infuraResult.path || graphResult.path!
}
