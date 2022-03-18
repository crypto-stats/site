import { NextApiRequest, NextApiResponse } from "next"
import { getCollectionNames } from "utils/lists-chain"

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const result = await getCollectionNames()

  res.setHeader("Cache-Control", "max-age=0, s-maxage=10, stale-while-revalidate")
  res.json({ success: true, result })
}

export default handler
