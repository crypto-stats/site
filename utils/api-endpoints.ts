import { NextApiRequest, NextApiResponse } from "next"

export const handleErrors =
  (fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  (req: NextApiRequest, res: NextApiResponse) => {
    fn(req, res).catch((error: any) =>
      res.status(400).json({
        success: false,
        error: error.message,
      })
    )
  }
