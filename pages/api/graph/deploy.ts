import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    throw new Error('Only POST requests allowed')
  }

  if (!req.headers.authorization) {
    res.status(400).json({ error: 'Must provide Authorization' })
    return
  }

  await fetch('https://api.thegraph.com/deploy/', {
    method: 'POST',
    body: JSON.stringify(req.body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: req.headers.authorization,
    },
  })
    .then(async _res => {
      if (_res.headers.get('Content-Type')?.indexOf('application/json') !== 0) {
        res.status(500).end(await _res.text())
      }
      res.json(await _res.json())
    })
    .catch(err => res.status(500).json(err))
}

export default handler
