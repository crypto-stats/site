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

const Hero = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 40px 0 60px;
`

const Type = styled.div`
  font-size: 12px;
  color: #808080;
  text-transform: uppercase;
`

const Title = styled.h1`
  font-size: 36px;
  font-weight: 600;
  margin: 6px 0 20px;
`

const Description = styled.p`
  color: #808080;
`

const HeroBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
      breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Discover', path: '/discover' }]}
      hero={
        <Hero>
          <Type>Collection</Type>
          <Title>{metadata?.name || listId}</Title>
          
          {metadata?.description && <Description>{metadata?.description}</Description>}
          
          <HeroBottom>
            Adapters: {adapters.length} - SubAdapters: {subadapters.length}
            <Button onClick={() => setShowDataModal(true)}>Use Collection Data</Button>
          </HeroBottom>
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
