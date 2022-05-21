import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    throw new Error('Only POST requests allowed')
  }

  fetch(
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${req.body.address}&apikey=${process.env.ETHERSCAN_KEY}`,
    {
      method: 'GET',
    }
  )
    .then(async _res => {
      if (_res.headers.get('Content-Type')?.indexOf('application/json') !== 0) {
        res.status(500).end(await _res.text())
      }
      res.json(await _res.json())
    })
    .catch(err => res.status(500).json(err))
}

export default handler
