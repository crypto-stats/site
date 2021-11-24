import { NextPage, GetStaticProps } from 'next'
import TranquilLayout from 'components/layouts/TranquilLayout'
import { getListNames, getModulesForList } from 'utils/lists-chain'
import CardList from 'components/CardList'

interface List {
  name: string
  modules: string[]
}

interface AdaptersPageProps {
  lists: List[]
}

const DiscoverPage: NextPage<AdaptersPageProps> = ({ lists }) => {
  const listItems = lists
    .sort((a: List, b: List) => b.modules.length - a.modules.length)
    .map((list: { name: string, modules: string[] }) => ({
      title: list.name,
      description: 'Lorem ipsum',
      metadata: [`${list.modules.length} adapters`],
      link: `/discover/${list.name}`,
    }))

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
        <CardList items={listItems} />
      </div>
    </TranquilLayout>
  )
}

export default DiscoverPage


export const getStaticProps: GetStaticProps<AdaptersPageProps> = async () => {
  const listNames = await getListNames()

  const lists = await Promise.all(listNames.map(async (name: string) => ({
    name: name,
    modules: await getModulesForList(name),
  })))

  return {
    props: {
      lists
    },
    revalidate: 60,
  }
}
