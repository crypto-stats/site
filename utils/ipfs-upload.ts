import * as fs from 'fs'
import pinataSDK from '@pinata/sdk'
import { create } from 'ipfs-http-client'

const filePath = '/tmp/upload.txt'

export async function saveToIPFS(file: string | Buffer, name: string): Promise<string> {
  if (!process.env.PINATA_KEY || !process.env.PINATA_SECRET) {
    throw new Error('Pinata key missing')
  }

  let failedUpload: string | null = null
  const failHandler = (name: string) => () => {
    if (failedUpload) {
      throw new Error(`Uploads to ${failedUpload} and ${name} both failed`)
    }
    failedUpload = name
    return { IpfsHash: null, path: null }
  }

  const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET)
  fs.writeFileSync(filePath, file)
  const pinataPromise = pinata
    .pinFromFS(filePath, {
      pinataMetadata: {
        name,
        // @ts-ignore
        keyvalues: {
          type: 'module',
        },
      },
    })
    .catch(failHandler('pinata'))

  const graphNode = create('https://api.thegraph.com/ipfs/api/v0' as any)
  const graphPromise = graphNode.add(file)

  const csNode = create('https://ipfs.cryptostats.community' as any)
  const csPromise = csNode.add(file).catch(failHandler('CryptoStats'))

  const [pinataResult, graphResult, csResult] = await Promise.all([
    pinataPromise,
    graphPromise,
    csPromise,
  ])

  if (failedUpload) {
    console.warn(`2 out of 3 uploads successful, upload to ${failedUpload} failed`)
  }

  if (pinataResult.IpfsHash && graphResult.path && pinataResult.IpfsHash !== graphResult.path) {
    throw new Error(`Mismatched CIDs: ${pinataResult.IpfsHash} & ${graphResult.path}`)
  }
  if (pinataResult.IpfsHash && csResult.path && pinataResult.IpfsHash !== csResult.path) {
    throw new Error(`Mismatched CIDs: ${pinataResult.IpfsHash} & ${csResult.path}`)
  }

  return pinataResult.IpfsHash || graphResult.path!
}
