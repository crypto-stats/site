import { NextApiRequest, NextApiResponse } from 'next'
import { SitemapStream } from 'sitemap'
import { getAllVerifiedAdapters, getCollectionNames } from 'utils/lists-chain'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate')

  const smStream = new SitemapStream({ hostname: 'https://cryptostats.community/' })
  smStream.pipe(res)

  smStream.write({ url: '/' })
  smStream.write({ url: '/how-it-works' })
  smStream.write({ url: '/discover' })

  const [collectionNames, adapters] = await Promise.all([
    getCollectionNames(),
    getAllVerifiedAdapters(),
  ])

  for (const collection of collectionNames) {
    smStream.write({ url: `/discover/${collection}`, priority: 0.4 })
  }

  for (const adapter of adapters) {
    const slug = adapter.slug || adapter.cid
    smStream.write({ url: `/discover/${adapter.collection}/${slug}`, priority: 0.3 })
  }

  smStream.end()
}

export default handler
