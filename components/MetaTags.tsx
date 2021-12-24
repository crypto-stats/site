import Head from 'next/head'
import React from 'react'

interface MetaTagsProps {
  title: string
  description: string
}

const MetaTags: React.FC<MetaTagsProps> = ({ title, description }) => {
  const fullTitle = `${title} - CryptoStats`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@CryptoStats_" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    </Head>
  )
}

export default MetaTags
