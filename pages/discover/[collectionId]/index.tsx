import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import { CryptoStatsSDK, Adapter } from '@cryptostats/sdk'
import styled from 'styled-components'
import TranquilLayout from 'components/layouts/TranquilLayout'
import APIExplainer from 'components/APIExplainer'
import Button from 'components/Button'
import AdapterCardList from 'components/AdapterCardList'
import SiteModal from 'components/SiteModal'
import { getCollectionNames, getModulesForCollection } from 'utils/lists-chain'
import collectionMetadata, { CollectionMetadata } from 'resources/collection-metadata'
import { usePlausible } from 'next-plausible'
import { getSlug } from 'utils/adapters'
import Text from 'components/Text'
import IconRound from 'components/IconRound'

const Hero = styled.div`
  margin: var(--spaces-5) 0 0;
`

const CardIcon = styled(IconRound)`
  padding-right: var(--spaces-3);
`

const CollectionName = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spaces-4);
`

const CollectionNameDetails = styled.div`
  margin-left: var(--spaces-4);
`

const CollectionDetails = styled.div`
  margin-top: var(--spaces-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
`

interface SubAdapter {
  id: string
  name: string
  icon: string | null
  description: string | null
}

interface AdapterData {
  cid: string
  slug: string | null
  name: string
  version: string | null
  subadapters: SubAdapter[]
  description: string | null
}

interface ListPageProps {
  collectionId: string
  adapters: AdapterData[]
  metadata: CollectionMetadata | null
}

const DiscoverPage: NextPage<ListPageProps> = ({ adapters, collectionId, metadata }) => {
  const plausible = usePlausible()
  const [showDataModal, setShowDataModal] = useState(false)

  useEffect(() => {
    if (showDataModal) {
      plausible('open-data-modal')
    }
  }, [showDataModal])

  const listItems = adapters.map((adapter: AdapterData) => ({
    title: adapter.name,
    description: adapter.description,
    version: adapter.version,
    metadata: [`${adapter.subadapters.length} subadapters`],
    iconlist: adapter.subadapters.map((subadapter: SubAdapter) => ({
      path: subadapter.icon || '', // TODO placeholder
      title: subadapter.name,
    })),
    link: `/discover/${collectionId}/${adapter.slug || adapter.cid}`,
  }))

  return (
    <>
      <Head>
        <title>{metadata?.name} Collection | CryptoStats</title>
        <meta name="description" content={metadata?.description} />
      </Head>
      <TranquilLayout
        page="collection"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Discover', path: '/discover' },
        ]}
        hero={
          <Hero>
            <CollectionName>
              {metadata?.icon && <CardIcon color={metadata?.iconColor} icon={metadata?.icon} />}
              <CollectionNameDetails>
                <Text tag="p" type="label">
                  Collection
                </Text>
                <Text tag="h1" type="title" mt="8">
                  {metadata?.name || collectionId}
                </Text>
              </CollectionNameDetails>
            </CollectionName>

            {metadata?.description && (
              <Text tag="p" type="description" mb="16">
                {metadata?.description}
              </Text>
            )}

            <CollectionDetails>
              <div>
                <Text tag="span" type="label">
                  Adapters:{' '}
                </Text>
                <Text tag="span" type="content">
                  {adapters.length}
                </Text>
              </div>
              <div>
                <Button onClick={() => setShowDataModal(true)} className="primary">
                  Use Collection Data
                </Button>
              </div>
            </CollectionDetails>
          </Hero>
        }
      >
        <>
          <AdapterCardList items={listItems} />
        </>

        <SiteModal
          title="Use this data on your website"
          isOpen={showDataModal}
          onClose={() => setShowDataModal(false)}
        >
          <APIExplainer listId={collectionId} />
        </SiteModal>
      </TranquilLayout>
    </>
  )
}

export default DiscoverPage

export const getStaticProps: GetStaticProps<ListPageProps, { collectionId: string }> = async (
  ctx: GetStaticPropsContext
) => {
  const collectionId = ctx.params!.collectionId as string
  const adapterCids = await getModulesForCollection(collectionId)
  const sdk = new CryptoStatsSDK({})

  const adapters = await Promise.all(
    adapterCids.map(async (cid: string): Promise<AdapterData> => {
      const collection = sdk.getCollection(cid)
      const module = await collection.fetchAdapterFromIPFS(cid)

      const subadapters = await Promise.all(
        collection.getAdapters().map(async (adapter: Adapter) => {
          const metadata = await adapter.getMetadata()
          const subadapter: SubAdapter = {
            id: adapter.id,
            name: metadata.name || adapter.id,
            icon: metadata.icon || null,
            description: metadata.description || null,
          }
          return subadapter
        })
      )

      return {
        cid,
        name: module.name || cid,
        version: module.version,
        slug: getSlug(module.name),
        description:
          module.description || (subadapters.length === 1 && subadapters[0].description) || null,
        subadapters,
      }
    })
  )

  return {
    props: {
      collectionId,
      adapters,
      metadata: collectionMetadata[collectionId] || null,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const listNames = await getCollectionNames()

  return {
    paths: listNames.map((collectionId: string) => ({ params: { collectionId } })),
    fallback: 'blocking',
  }
}
