import * as fs from 'fs'
import pinataSDK from '@pinata/sdk'

const filePath = '/tmp/upload.txt';

export async function saveToIPFS(file: string, name: string): Promise<string> {
  if (!process.env.PINATA_KEY || !process.env.PINATA_SECRET) {
    throw new Error('Pinata key missing')
  }

  const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET)
  fs.writeFileSync(filePath, file);
  const response = await pinata.pinFromFS(filePath, {
    pinataMetadata: {
      name,
      // @ts-ignore
      keyvalues: {
        type: 'module',
      },
    },
  });

  return response.IpfsHash;
}
