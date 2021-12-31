import React, { useEffect, useState } from 'react'
import { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import { CryptoStatsSDK, Adapter } from '@cryptostats/sdk'
import styled from 'styled-components'
import TranquilLayout from 'components/layouts/TranquilLayout'
import APIExplainer from 'components/APIExplainer'
import Button from 'components/Button'
import CardList from 'components/CardList'
import SiteModal from 'components/SiteModal'
import { getListNames, getModulesForList } from 'utils/lists-chain'
import collectionMetadata, { CollectionMetadata } from 'resources/collection-metadata'
import { usePlausible } from 'next-plausible'
import { getSlug } from 'utils/adapters'
import Text from "components/Text"
import RowSection from "components/RowSection"
import ColumnSection from "components/ColumnSection"

const Hero = styled.div`
  margin: var(--spaces-5) 0;
`

interface SubAdapter {
  id: string
  name: string
  icon: string | null
}

interface AdapterData {
  cid: string
  slug: string | null
  name: string
  subadapters: SubAdapter[]
  description: string | null
}

interface ListPageProps {
  listId: string,
  adapters: AdapterData[]
  subadapters: SubAdapter[]
  metadata: CollectionMetadata | null
}

const DiscoverPage: NextPage<ListPageProps> = ({ adapters, subadapters, listId, metadata }) => {
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
    metadata: [`${adapter.subadapters.length} subadapters`],
    iconlist: adapter.subadapters.map((subadapter: SubAdapter) => ({
      path: subadapter.icon || '', // TODO placeholder
      title: subadapter.name,
    })),
    link: `/discover/${listId}/${adapter.slug || adapter.cid}`,
  }))

  return (
    <TranquilLayout
      page="collection"
      breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Discover', path: '/discover' }]}
      hero={
        <Hero>
          <Text tag="p" type="label">Collection</Text>
          <Text tag="h1" type="title" mt="8" mb="16">{metadata?.name || listId}</Text>
          
          {metadata?.description && <Text tag="p" type="description" mb="16">{metadata?.description}</Text>}
          
          <RowSection alignItems="center" noMargin>
            <ColumnSection columns="9">
              <Text tag="p" type="content">
                Adapters: {adapters.length} - SubAdapters: {subadapters.length}
              </Text>
            </ColumnSection>
            <ColumnSection columns="3">
              <Button onClick={() => setShowDataModal(true)}>Use Collection Data</Button>
            </ColumnSection>
          </RowSection>
        </Hero>
      }
    >
      <div>
        <CardList items={listItems} />
      </div>

      <SiteModal
        title="Use this data on your website"
        isOpen={showDataModal}
        onClose={() => setShowDataModal(false)}
      >
        <APIExplainer listId={listId}/>
      </SiteModal>
    </TranquilLayout>
  )
}

export default DiscoverPage

export const getStaticProps: GetStaticProps<ListPageProps, { listId: string }> = async (ctx: GetStaticPropsContext) => {
  const listId = ctx.params!.listId as string
  const adapterCids = await getModulesForList(listId)
  const sdk = new CryptoStatsSDK({})

  const allSubadapters: SubAdapter[] = []

  const adapters = await Promise.all(adapterCids.map(async (cid: string): Promise<AdapterData> => {
    const list = sdk.getList(cid)
    const module = await list.fetchAdapterFromIPFS(cid)

    const subadapters = await Promise.all(list.getAdapters().map(async(adapter: Adapter) => {
      const metadata = await adapter.getMetadata()
      const subadapter: SubAdapter = {
        id: adapter.id,
        name: metadata.name || adapter.id,
        icon: metadata.icon || null,
      }

      allSubadapters.push(subadapter)
      return subadapter
    }))

    return {
      cid,
      name: module.name || cid,
      slug: getSlug(module.name),
      description: module.description || null,
      subadapters,
    }
  }))

  return {
    props: {
      listId,
      adapters,
      subadapters: allSubadapters,
      metadata: collectionMetadata[listId] || null,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const listNames = await getListNames()

  return {
    paths: listNames.map((listId: string) => ({ params: { listId } })),
    fallback: 'blocking',
  }
}
