import Head from "next/head"
import React from "react"

interface MetaTagsProps {
  title: string
  description: string
}

const MetaTags: React.FC<MetaTagsProps> = ({ title, description }) => {
  const fullTitle = `${title} - CryptoStats`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:site' content='@CryptoStats_' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
    </Head>
  )
}

export default MetaTags
