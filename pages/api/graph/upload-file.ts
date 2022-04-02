import { NextApiRequest, NextApiResponse } from 'next'
import { saveToIPFS } from 'utils/ipfs-upload'
import { handleErrors } from 'utils/api-endpoints'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    throw new Error('Only POST requests allowed')
  }

  const cid = await saveToIPFS(req.body.file, req.body.name)

  res.json({ success: true, cid })
}

export default handleErrors(handler)
