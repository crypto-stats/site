import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    throw new Error('Only POST requests allowed')
  }

  console.log({ b: req.body })

  // if (!req.headers.authorization) {
  //   res.status(400).json({ error: 'Must provide Authorization' })
  //   return
  // }

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
      // const res2 = await _res.json()
      // console.log(res2)
      res.json(await _res.json())
    })
    .catch(err => res.status(500).json(err))
}

export default handler
