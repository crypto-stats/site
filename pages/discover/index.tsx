import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import styled from 'styled-components';
import TranquilLayout from 'components/layouts/TranquilLayout'
import { getListNames, getModulesForList } from 'utils/lists-chain'
import CardList from 'components/CardList'
import collectionMetadata from 'resources/collection-metadata'
import Text from 'components/Text'

const HeroWrapper = styled.div`
  margin: var(--spaces-10) 0 0;
  text-align: center;
  
  @media ( min-width: 768px ) {
    max-width: 70%;
    margin-right: auto;
    margin-left: auto;
  }
`

const MainContainer = styled.div`
  margin-top: var(--spaces-6);
`

interface Collection {
  id: string
  modules: string[]
}

interface AdaptersPageProps {
  collections: Collection[]
}

const DiscoverPage: NextPage<AdaptersPageProps> = ({ collections }) => {
  const collectionItems = collections
    .sort((a: Collection, b: Collection) => b.modules.length - a.modules.length)
    .map((collection: { id: string, modules: string[] }) => {
      const metadata = collectionMetadata[collection.id]
      return {
        title: metadata?.name || collection.id,
        subtitle: metadata ? collection.id : null,
        description: metadata?.description,
        icon: metadata?.icon,
        iconColor: metadata?.iconColor,
        metadata: [`${collection.modules.length} adapters`],
        link: `/discover/${collection.id}`,
      }
    })

  return (
    <>
      <Head>
        <title>Discover Collections | CryptoStats</title>
        <meta name="description" content="The most valuable crypto metrics, curated and managed by the community." />
      </Head>
      <TranquilLayout
        page="discover"
        hero={
          <HeroWrapper>
            <Text tag="h1" type="display">Discover our Collections</Text>
            <Text tag="p" type="description" mt="16">The most valuable crypto metrics, curated and managed by the community</Text>
          </HeroWrapper>
        }
      >
        <MainContainer>
          <CardList items={collectionItems} />
        </MainContainer>
      </TranquilLayout>
    </>
  )
}

export default DiscoverPage

export const getStaticProps: GetStaticProps<AdaptersPageProps> = async () => {
  const listNames = await getListNames()

  const collections = await Promise.all(listNames.map(async (name: string): Promise<Collection> => ({
    id: name,
    modules: await getModulesForList(name),
  })))

  return {
    props: {
      collections
    },
    revalidate: 60,
  }
}
