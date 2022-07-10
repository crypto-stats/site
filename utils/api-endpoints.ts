import { NextApiRequest, NextApiResponse } from 'next'

export const handleErrors =
  (fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  (req: NextApiRequest, res: NextApiResponse) => {
    return fn(req, res).catch((error: any) => {
      console.warn('Returning error', error)
      res.status(400).json({
        success: false,
        error: error.message,
      })
    })
  }
