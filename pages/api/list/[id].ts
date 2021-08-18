import { NextApiRequest, NextApiResponse } from 'next'
import pinataSDK from '@pinata/sdk'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const listId = req.query.id.toString();
  if (!/^[a-zA-Z]+$/.test(listId)) {
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=60, stale-while-revalidate');
    res.json({ success: false, error: `Invalid id ${listId}` })
    return
  }

  if (!process.env.PINATA_KEY || !process.env.PINATA_SECRET) {
    throw new Error('Pinata key missing')
  }

  const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET)

  const pinnedItems = await pinata.pinList({
    metadata: {
      keyvalues: {
        list: {
          value: `^${listId}$|^(?:[^,\n]+,)*${listId},(?:[^,\n]+,)*[^,\n]+$|^(?:[^,\n]+,)*${listId}$`,
          op: 'regexp',
        }
      }
    }
  });

  const result = pinnedItems.rows.map((row) => row.ipfs_pin_hash)

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=10, stale-while-revalidate');
  res.json({ success: true, result })
}

export default handler
