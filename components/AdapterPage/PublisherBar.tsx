import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import collectionMetadata, { DEFAULT_FORUM_CATEGORY } from 'resources/collection-metadata'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  font-size: 16px;
  color: #002750;
  align-items: center;
`

const Left = styled.div`
  font-weight: bold;
`

const PublishButton = styled.a`
  display: inline-block;
  border-radius: 4px;
  border: solid 1px #0477f4;
  line-height: 26px;
  font-size: 14px;
  font-weight: 500;
  color: #0477f4;
  text-decoration: none;
  margin-left: 4px;
  padding: 0 4px;
`

interface PublisherBarProps {
  address: string
  collections: string[]
  name?: string | null
  version?: string | null
  previous?: string | null
}

const PublisherBar: React.FC<PublisherBarProps> = ({
  address,
  collections,
  name,
  version,
  previous,
}) => {
  const router = useRouter()

  const { cid, collectionId } = router.query

  useEffect(() => {
    for (const collection of collections) {
      if (collection !== collectionId) {
        router.prefetch(`/discover/${collection}/${cid}`)
      }
    }
  }, [collections])

  const navigate = (e: any) => {
    router.push(`/discover/${e.target.value}/${cid}`)
  }

  const params = new URLSearchParams()
  params.append(
    'title',
    `${previous ? 'Updated Adapter' : 'New Adapter'}${name ? ` - ${name}` : ''}${
      version ? ` v${version}` : ''
    }`
  )
  params.append(
    'body',
    `I've published ${previous ? 'an updated adapter' : 'a new adapter'} for ${name || ''}

https://cryptostats.community/discover/${collectionId}/${cid}
`
  )
  params.append(
    'category',
    collectionMetadata[collectionId as string]?.forumCategory || DEFAULT_FORUM_CATEGORY
  )

  return (
    <Container>
      <Left>This adapter was signed by you, {address.substr(0, 10)}</Left>

      <div>
        Create a forum post to verify it in the {}
        <select value={collectionId} onChange={navigate}>
          <option value="adapter">(collection)</option>
          {collections.map((collection: string) => (
            <option key={collection} value={collection}>
              {collection}
            </option>
          ))}
        </select>
        {} collection.
        {collectionId !== 'adapter' && (
          <PublishButton
            href={`https://forum.cryptostats.community/new-topic?${params.toString()}`}
            target="forum"
          >
            Publish on Forum
          </PublishButton>
        )}
      </div>
    </Container>
  )
}

export default PublisherBar
