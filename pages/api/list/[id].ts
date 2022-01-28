import { NextApiRequest, NextApiResponse } from 'next'
import { getModulesForCollection } from 'utils/lists-chain'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const collectionId = req.query.id.toString();
  if (!/^[a-zA-Z0-9-]+$/.test(collectionId)) {
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=60, stale-while-revalidate');
    res.json({ success: false, error: `Invalid id ${collectionId}` })
    return
  }

  const result = await getModulesForCollection(collectionId)

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=10, stale-while-revalidate');
  res.json({ success: true, result })
}

export default handler
