import React from 'react'
import { NextPage, GetStaticProps } from 'next'
import MetaTags from 'components/MetaTags'
import { BlogPost, getBlogPostList } from 'utils/blog'
import TranquilLayout from 'components/layouts/TranquilLayout'
import styled from 'styled-components'
import CardList from 'components/CardList'

const Title = styled.h1`
  font-size: 36px;
`

interface BlogProps {
  posts: BlogPost[]
}

export const Blog: NextPage<BlogProps> = ({ posts }: { posts: BlogPost[] }) => {
  const blogPosts = posts
    .sort(
      (a: BlogPost, b: BlogPost) =>
        new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    )
    .map(post => {
      return {
        title: post.title,
        description: post.metadata.tagline,
        thumbnail: post.metadata.image,
        metadata: [
          `By ${post.metadata.author}`,
          post.date
            ? new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : '',
        ],
        link: `/blog/${post.slug}`,
      }
    })

  return (
    <TranquilLayout
      page="blog"
      hero={
        <div>
          <Title>CryptoStats Blog</Title>
        </div>
      }
    >
      <MetaTags
        title="CryptoStats Blog"
        description="Writing about the tooling and data in the crypto metrics ecosystem"
      />

      <CardList items={blogPosts} />

      <style jsx>{`
        .posts {
          display: flex;
          padding: 0;
        }

        .posts li {
          list-style: none;
          margin: 8px;
        }

        .posts a {
          display: block;
          width: 400px;
          height: 200px;
          border: solid 1px black;
          border-radius: 4px;
          box-sizing: border-box;
          padding: 8px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          text-decoration: none;
          background-position: center;
          background-size: 100%;
          position: relative;
          transition: background-size 0.2s;
        }
        .posts a:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.4;
          background: #eeeeee;
          z-index: 0;
        }
        .posts a:hover {
          content: '';
          background-size: 110%;
          color: black;
        }
        .posts * {
          z-index: 1;
        }

        .link-title {
          font-weight: bold;
          font-size: 18px;
        }
        .link-date {
          color: #555;
          font-size: 14px;
        }

        .nav-links,
        .nav-links a {
          font-size: 14px;
          color: #555;
        }
        .nav-links a:hover {
          color: #999;
        }
      `}</style>
    </TranquilLayout>
  )
}

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  const posts = await getBlogPostList()

  return { props: { posts }, revalidate: 60 * 60 }
}

export default Blog
