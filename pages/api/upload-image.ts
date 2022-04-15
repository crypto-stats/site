import * as fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import pinataSDK from '@pinata/sdk'

const filePath = '/tmp/upload.bin'

async function saveToIPFS(stream: any, name: string, type: string): Promise<string> {
  if (!process.env.PINATA_KEY || !process.env.PINATA_SECRET) {
    throw new Error('Pinata key missing')
  }

  const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET)
  const fileStream = fs.createWriteStream(filePath)
  stream.pipe(fileStream)
  const response = await pinata.pinFromFS(filePath, {
    pinataMetadata: { name, type, category: 'image' },
  })

  return response.IpfsHash
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })
    return
  }

  const { name, type } = req.headers
  if (!name || !type) {
    throw new Error('Upload must include name/type')
  }

  const cid = await saveToIPFS(req, name.toString(), type.toString())
  console.log('Uploaded image', cid)
  res.json({ cid })
}

export default handler

export const config = {
  api: {
    bodyParser: false,
  },
}
