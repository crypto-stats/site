import { NextApiRequest, NextApiResponse } from 'next'
import { saveToIPFS } from 'utils/ipfs-upload'
import { handleErrors } from 'utils/api-endpoints'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    throw new Error('Only POST requests allowed')
  }

  let file: string | Buffer = req.body.file

  if (req.body.encoding === 'base64') {
    file = Buffer.from(file as string, 'base64')
  }

  const cid = await saveToIPFS(file, req.body.name)

  res.json({ success: true, cid })
}

export default handleErrors(handler)
