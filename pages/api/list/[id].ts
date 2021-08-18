import { NextApiRequest, NextApiResponse } from 'next'
import { getModulesForList } from 'utils/lists'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const listId = req.query.id.toString();
  if (!/^[a-zA-Z]+$/.test(listId)) {
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=60, stale-while-revalidate');
    res.json({ success: false, error: `Invalid id ${listId}` })
    return
  }

  const result = await getModulesForList(listId)

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=10, stale-while-revalidate');
  res.json({ success: true, result })
}

export default handler
