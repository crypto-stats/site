import * as fs from 'fs'
import pinataSDK from '@pinata/sdk'
import { create } from 'ipfs-http-client'

const filePath = '/tmp/upload.txt';

export async function saveToIPFS(file: string, name: string): Promise<string> {
  if (!process.env.PINATA_KEY || !process.env.PINATA_SECRET) {
    throw new Error('Pinata key missing')
  }

  const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET)
  fs.writeFileSync(filePath, file);
  const pinataPromise = pinata.pinFromFS(filePath, {
    pinataMetadata: {
      name,
      // @ts-ignore
      keyvalues: {
        type: 'module',
      },
    },
  });

  const graphNode = create('https://api.thegraph.com/ipfs/api/v0' as any)
  const graphPromise = graphNode.add(file)

  const csNode = create('https://ipfs.cryptostats.community' as any)
  const csPromise = csNode.add(file)

  const [pinataResult, graphResult, csResult] = await Promise.all([pinataPromise, graphPromise, csPromise])

  if (pinataResult.IpfsHash !== graphResult.path) {
    throw new Error(`Mismatched CIDs: ${pinataResult.IpfsHash} & ${graphResult.path}`)
  }
  if (pinataResult.IpfsHash !== csResult.path) {
    throw new Error(`Mismatched CIDs: ${pinataResult.IpfsHash} & ${csResult.path}`)
  }

  return pinataResult.IpfsHash;
}
