import { NextPage, GetStaticProps } from 'next'
import Link from 'next/link';
import TranquilLayout from 'components/layouts/TranquilLayout'
import { getListNames, getModulesForList } from 'utils/lists'

interface AdaptersPageProps {
  lists: { name: string; modules: string[] }[]
}

const DiscoverPage: NextPage<AdaptersPageProps> = ({ lists }) => {
  return (
    <TranquilLayout
      hero={
        <div>
          <h1>Discover our Collections</h1>
          <p>The most valuable crypto metrics, currated and managed by the community</p>
        </div>
      }
    >
      <ul>
        {lists.map(list => (
          <li key={list.name}>
            <div>{list.name}</div>
            <ul>
              {list.modules.map(_module => (
                <li key={_module}>
                  <Link href={`/module/${_module}`}>
                    <a>{_module}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
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
