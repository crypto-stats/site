import { NextPage, GetStaticProps } from 'next'
import TranquilLayout from 'components/layouts/TranquilLayout'
import { getListNames, getModulesForList } from 'utils/lists-chain'
import CardList from 'components/CardList'
import collectionMetadata from 'resources/collection-metadata'

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
        metadata: [`${collection.modules.length} adapters`],
        link: `/discover/${collection.id}`,
      }
    })

  return (
    <TranquilLayout
      hero={
        <div>
          <h1>Discover our Collections</h1>
          <p>The most valuable crypto metrics, currated and managed by the community</p>
        </div>
      }
    >
      <div>
        <CardList items={collectionItems} />
      </div>
    </TranquilLayout>
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
