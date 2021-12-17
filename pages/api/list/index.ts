import { NextApiRequest, NextApiResponse } from 'next'
import { getListNames } from 'utils/lists-chain'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const result = await getListNames()

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=10, stale-while-revalidate');
  res.json({ success: true, result })
}

export default handler
