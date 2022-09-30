import React from 'react'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote'
import dynamic from 'next/dynamic'
import MetaTags from 'components/MetaTags'
import { BlogPostWithSource, getBlogPost, getBlogPostList } from 'utils/blog'
import TranquilLayout from 'components/layouts/TranquilLayout'

interface BlogProps {
  post: BlogPostWithSource
}

const components = {
  h1: () => null,
  h2: ({ children }: { children: string }) => (
    <h2 id={children.toLowerCase().replace(/\W+/g, '-')}>{children}</h2>
  ),
  a: ({ children, href }: { children: string, href: string }) => href.charAt(0) === '/'
    ? (
      <Link href={href}>
        <a>{children}</a>
      </Link>
    ) : <a href={href}>{children}</a>,
  Img: ({ src }: { src: string }) => (
    <>
      <img className="blog-img" src={`https://blog-assets.cryptofees.info/${src}`} />
      <style jsx>{`
        .blog-img {
          width: 100%;
        }
      `}</style>
    </>
  ),
  Tweet: dynamic(() => import('react-twitter-embed').then(pkg => pkg.TwitterTweetEmbed)),
}

export const Blog: NextPage<BlogProps> = ({ post }) => {
  return (
    <TranquilLayout
      hero={
        <div>
          <h1>{post.title}</h1>
          <div className="date">
            {post.date && new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          {post.metadata.author && (
            <div>
              {post.metadata.authorLink ? (
                <a href={post.metadata.authorLink}>{post.metadata.author}</a>
              ) : (
                post.metadata.author
              )}
            </div>
          )}
        </div>
      }
    >
      <MetaTags
        title={post.title}
        description={post.metadata.tagline}
        image={post.metadata.image}
        article={{
          publishedTime: post.date ? new Date(post.date) : undefined,
          author: post.metadata.authorLink,
        }}
      />

      <article>
        <MDXRemote components={components as any} {...post.contentSource} />
      </article>

      <style jsx>{`
        main {
          padding: 2rem 0 3rem;
          flex: 1;
          width: 100%;
          max-width: 650px;
        }

        .title {
          margin: 10px 0 16px;
          line-height: 1.15;
          font-size: 32px;
          font-weight: 700;
        }

        .nav-links,
        .nav-links a {
          font-size: 14px;
          color: #555;
        }
        .nav-links a:hover {
          color: #999;
        }

        .subtitle {
          text-transform: uppercase;
          font-weight: bold;
          font-size: 20px;
          letter-spacing: -1px;
          color: #333;
        }

        .date {
          color: #333;
        }

        article {
          margin: 24px 0;
          overflow: hidden;
        }
        article :global(h2) {
          margin: 16px 0 4px;
          font-size: 26px;
        }
        article :global(h3) {
          margin: 16px 0 4px;
          font-size: 22px;
        }
        article :global(p) {
          margin: 0 0 22px;
          font-size: 20px;
          line-height: 150%;
        }
        article :global(li) {
          font-size: 20px;
        }
        article :global(hr) {
          margin: 32px 0;
        }

        article :global(iframe) {
          border: none;
        }
      `}</style>
    </TranquilLayout>
  )
}

export const getStaticProps: GetStaticProps<BlogProps, { slug: string }> = async ({ params }) => {
  const post = await getBlogPost(params!.slug)

  if (!post) {
    return {
      props: {},
      notFound: true,
    }
  }

  return { props: { post }, revalidate: 60 * 60 }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getBlogPostList()

  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: 'blocking',
  }
}

export default Blog
