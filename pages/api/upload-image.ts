import { NextApiRequest, NextApiResponse } from 'next'
import { getInfuraNode } from 'utils/ipfs-upload'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })
    return
  }

  const { name, type } = req.headers
  if (!name || !type) {
    throw new Error('Upload must include name/type')
  }

  const infuraNode = getInfuraNode()
  const response = await infuraNode.add(req)
  const cid = response.path

  console.log('Uploaded image', cid)
  res.json({ cid })
}

export default handler

export const config = {
  api: {
    bodyParser: false,
  },
}
