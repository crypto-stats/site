import Head from 'next/head'
import React from 'react'

interface ArticleProps {
  publishedTime?: Date;
  modifiedTime?: Date;
  author?: string;
  section?: string;
  tag?: string[];
}

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  article?: ArticleProps;
}


const MetaTags: React.FC<MetaTagsProps> = ({ title, description, image, article }) => {
  const fullTitle = `${title} - CryptoStats`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta name="twitter:site" content="@CryptoStats_" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:site_name" content="CryptoStats" />
      <meta property="og:description" content={description} />

      {image ? (
        <>
          <meta name="twitter:image" content={image} />
          <meta property="og:image" content={image} />
          <meta name="twitter:card" content="summary_large_image" />
        </>
      ) : (
        <meta name="twitter:card" content="summary" />
      )}

      {article && (
        <>
          {article.publishedTime && (
            <meta name="article:published_time" content={article.publishedTime.toISOString()} />
          )}
          {article.modifiedTime && (
            <meta name="article:modified_time" content={article.modifiedTime.toISOString()} />
          )}
          {article.author && <meta name="article:author" content={article.author} />}
          {article.section && <meta name="article:section" content={article.section} />}
          {article.tag &&
            article.tag.map((tag) => <meta name="article:tag" content={tag} key={tag} />)}
        </>
      )}
    </Head>
  )
}

export default MetaTags
